import os
import shutil
from PIL import Image

# Ensure directories exist
os.makedirs('public/assets/images', exist_ok=True)

# Copy base brand files
base_files = [
    'logo_principal.jpeg',
    'marca_completa.jpeg',
    'simbolo.jpeg',
    'version_packcaging.jpeg',
    'version_vertical.jpeg'
]

for f in base_files:
    if os.path.exists(f):
        shutil.copy(f, os.path.join('public/assets/images', f))
        print(f"Copied {f} to public/assets/images/")

# Copy generated images from artifact directory
brain_dir = r"C:\Users\julian\.gemini\antigravity-ide\brain\b79c166c-0d0a-4068-bce1-efc40f1ab3b3"
hero_src = os.path.join(brain_dir, "hero_pizzeta_artesanal_1791472208026.jpg")
clasicas_src = os.path.join(brain_dir, "prod_pizzetas_clasicas_1791472249937.jpg")
prepizzas_src = os.path.join(brain_dir, "prod_prepizzas_tradicionales_1791472311240.jpg")

if os.path.exists(hero_src):
    shutil.copy(hero_src, 'public/assets/images/hero_pizzeta.jpg')
    print("Copied hero_pizzeta.jpg")

if os.path.exists(clasicas_src):
    shutil.copy(clasicas_src, 'public/assets/images/prod_pizzetas_clasicas.jpg')
    print("Copied prod_pizzetas_clasicas.jpg")

if os.path.exists(prepizzas_src):
    shutil.copy(prepizzas_src, 'public/assets/images/prod_prepizzas_tradicionales.jpg')
    print("Copied prod_prepizzas_tradicionales.jpg")

# Crop specific high-res sections from marca_completa.jpeg
if os.path.exists('marca_completa.jpeg'):
    img = Image.open('marca_completa.jpeg')
    w, h = img.size
    print(f"marca_completa size: {w}x{h}")
    
    # Bottom right: Kraft delivery bag (approx bottom right quadrant)
    # y: ~60% to 100%, x: ~78% to 100%
    bag = img.crop((int(w * 0.78), int(h * 0.60), w, h))
    bag.save('public/assets/images/prod_bolsa_kraft.jpg', quality=95)
    print("Saved prod_bolsa_kraft.jpg")

    # Bottom left: Box packaging
    box = img.crop((0, int(h * 0.60), int(w * 0.38), h))
    box.save('public/assets/images/prod_caja_packaging.jpg', quality=95)
    print("Saved prod_caja_packaging.jpg")

    # Mobile mockup with pizzetas in phone
    phone = img.crop((int(w * 0.60), int(h * 0.62), int(w * 0.77), int(h * 0.98)))
    phone.save('public/assets/images/banner_mobile_feed.jpg', quality=95)
    print("Saved banner_mobile_feed.jpg")

    # Pizzetas on the phone screen
    phone_pizzeta = img.crop((int(w * 0.62), int(h * 0.75), int(w * 0.69), int(h * 0.83)))
    phone_pizzeta.save('public/assets/images/prod_pizzetas_muzzarella_close.jpg', quality=95)
    print("Saved prod_pizzetas_muzzarella_close.jpg")

print("Asset setup complete!")
