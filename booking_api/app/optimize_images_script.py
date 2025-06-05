import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from booking.models import Laboratory, LaboratoryContent, optimize_image
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import InMemoryUploadedFile
import hashlib
import io

# Models and fields to check for image references
IMAGE_MODELS = [
    (Laboratory, 'image'),
    (LaboratoryContent, 'image'),
    # Add more models/fields here if needed
]

# Directories to look for physical image files
IMAGE_DIRS = [
    'labs',
    'labs_content_photos',
    # Add more directories here if needed
]

def get_all_image_paths():
    """Returns a mapping of image paths to all model instances that reference them."""
    image_map = {}  # path -> list of (instance, field)
    for model, field in IMAGE_MODELS:
        for obj in model.objects.exclude(**{field: ""}).exclude(**{field: None}):
            path = getattr(obj, field).name
            if path not in image_map:
                image_map[path] = []
            image_map[path].append((obj, field))
    return image_map

def get_all_files_in_dirs(dirs):
    """Returns all files in the specified directories."""
    all_files = []
    media_root = os.path.abspath(default_storage.location)
    for d in dirs:
        dir_path = os.path.join(media_root, d)
        if os.path.exists(dir_path):
            for fname in os.listdir(dir_path):
                fpath = os.path.join(d, fname)
                all_files.append(fpath)
    return all_files

def optimize_and_update_all_images():
    image_map = get_all_image_paths()
    all_files = get_all_files_in_dirs(IMAGE_DIRS)
    optimized_hash_map = {}

    for path in all_files:
        try:
            if not default_storage.exists(path):
                print(f"File not found: {path}")
                continue

            # Read the original image
            with default_storage.open(path, "rb") as f:
                original_content = f.read()

            # Optimize the image
            optimized, ext, ct = optimize_image(io.BytesIO(original_content))
            if not ext:
                ext = os.path.splitext(path)[1].lower()
            md5_hash = hashlib.md5(original_content).hexdigest()
            new_name = os.path.join(os.path.dirname(path), f"{md5_hash}{ext}")

            # Save the optimized image if it does not already exist
            if not default_storage.exists(new_name):
                file = InMemoryUploadedFile(
                    io.BytesIO(optimized.read() if hasattr(optimized, "read") else original_content),
                    'image',
                    os.path.basename(new_name),
                    ct or 'application/octet-stream',
                    len(optimized.getvalue()) if hasattr(optimized, "getvalue") else len(original_content),
                    None
                )
                default_storage.save(new_name, file)

            # Update all references to this image in the database
            if path in image_map:
                for obj, field in image_map[path]:
                    current = getattr(obj, field).name
                    if current != new_name:
                        setattr(getattr(obj, field), 'name', new_name)
                        obj.save(update_fields=[field])
                        print(f"Updated {obj} ({field}): {current} -> {new_name}")

            # Delete the old image if the name changed and it is no longer referenced
            if path != new_name and default_storage.exists(path):
                # Check all models/fields to see if anyone still references the old path
                still_used = False
                for model, field in IMAGE_MODELS:
                    if model.objects.filter(**{field: path}).exists():
                        still_used = True
                        break
                if not still_used:
                    default_storage.delete(path)
                    print(f"Deleted old image: {path}")

        except Exception as e:
            print(f"Error with {path}: {e}")

if __name__ == "__main__":
    optimize_and_update_all_images()