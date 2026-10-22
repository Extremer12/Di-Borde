import urllib.request
import os

images = {
    'sabor_artesanal_banner.png': 'https://lh3.googleusercontent.com/aida/AEtjO1W2SAHMw6G19SU84HUgJuk0GlKTx8Pgwjtzb_cljMdlm6aAe9Cb6ACxnY_LeG6d4y-6CDtximtwVZW7BpLrd6HelWHe_aATHlxG_j5vtQ2u_iJ5a-KY2F_dLBy0pzlR7Sb6PZsoJ76Yaq7VLQkVKTRvwDCMiWek3PrqE-vfSQjIDGZtvXZwlfWmEEZND6xr-Lh0S4t__xXehJKtqAY57ZGM-KTR4HX3mQQjNhGvwadghFaPITqAtSA2R54',
    'catalogo_carrito_ref.png': 'https://lh3.googleusercontent.com/aida/AEtjO1XyG6Y9fWV1jIcitDQwstRwIynbuNHO9uKMAAnpRNwNWAadVf7PSaYs6ov18hjVLS2B_-y445ZPGgL8AtGQWmx5MHnsDALo6M6hXggY_Q9zy3tUJN5jGdstoZgDYzjNqiquuD9FPHj17lduGAxpa7q4dQTRP7iPrGBssLoRHZPWIJa5xPVRVZtiFaq7Qbz2wfzobLRvOqgw5AaVbIZ4l-ysEkWIaXbuK6x62lkY26tzqDprW5l_6nGypg',
    'packaging_whatsapp.jpeg': 'https://lh3.googleusercontent.com/aida/AEtjO1VvuS72nqaFoqOPgyoNcu23wUgCM3z_q8MrQbhXw825MW6auMO-kTHvVU7BrAjZg7KbJLoK9vQaPVyjzIoFaU7Rfn-kf7EFP1a4SdsYTY-hjG_7k5uw-4wq54uBRMu2Gk5bREEou4uFobKer0J9HxYL1uGEGszORWevc-jOb5wEtVh37T-8rxpa9dDhhpX03GKpw_gtMQIlCA9foh93QMEZGsXMDgbOtz6f9_l3RcohaB4MdR9Rh-afkA',
    'app_mobile_ref.png': 'https://lh3.googleusercontent.com/aida/AEtjO1VVFsiPLvvfKcXnpDTMmUyqv__CT3bk4GMVQCmr6G4duaFUdEp20bnEYSzxN31Qn49_7HUbHATLrft8UAvVG9DMW6_w-UF72U8VX08AqNrwcc5RooIHLMU-w9DOtf7U4VhARfQDZ4J_eppUT_eplBnV1PzoCbK81sJlo9qdRq8b4EtYw5VO10gZtYitOCUg6WAU6hjUIjzlSNA8je5pzewlIKPQz1RpLl2TFMdkfVAiy0gvrM22xxeDvmo',
    'stitch_home_screenshot.png': 'https://lh3.googleusercontent.com/aida/AEtjO1WQjKFozXgr3wroH6zouWj4RbjahtjJGk_YYC7ikc7h-2Cy4sol5NxucaeHwWGsjHAjX7HFdQ75s6GmLjzML1wtm4epotuM65XsP8u3MdLbDHqxqXyZf6YIDOmucQca7tdbh692mT4uc1Kv5awBO18WGRwXWV-exXv7LgvSCWODI-Fd7AmPF3dykeuhDFJltIwSGMXEXNDEpSj76sO67brm2VS0h4BV4E7Wkyry0wmb',
    'stitch_catalogo_cart_screenshot.png': 'https://lh3.googleusercontent.com/aida/AEtjO1XwfISpIqWrpGHKfIULMTrcICaJP7mWMQz0a0ZuyoqasqAoQBddkLi9SmJUTOKsjjXBYPgN8dyG7KsYvmuPYA5OiQehkLZeFO4YXTdi_Y-iv5OBLLYbPN8UM6W7nyUyBHyYcaGLuK1-ffbWGUgrwSekh5nXQBGDkRTkgCNyYujCa4zc3yp5ZsSSpnhRErIVcs8EQ40R-Fi1SjMtbeDi-aNVVagSfPs6LfW-SeRDTvE',
    'stitch_detalle_screenshot.png': 'https://lh3.googleusercontent.com/aida/AEtjO1X-KgRKay8odOt1BkeapmGcdeu5dCSt6i2rYG8cBx8BqahLanTND-25BBMKOpBSKcfmHkeJ4ffmfwJYv2Ctu5miy7Yy7ppD58hVDRVNQM0YdR-xJsKPeLrGA8H2dBWVmIbGQ2jk1zF1gjo82qOCflhr-Cbtw1SlkpPcUZR17mzTUKGWTpkkj9gE30QEygdeCoiv3_pfspf-V0MpHjms3qBm6qr3I5RGhXgqxh69Qqk',
    'stitch_b2b_screenshot.png': 'https://lh3.googleusercontent.com/aida/AEtjO1U-DzZVO1amcQZ2XMvohKmhbFH2pCK_Re6cV9072k0YffUyJCZNaeS9JKhRZnKm7Nw9HZKnw38Fynsz8SU4LFU-Jx2wqXQZeWJv_Z15ruiHy1PzRQ2gxglPBMZufHjq8FZx2xec2GkQvTNUZY2wBRgY2oZ1mON-QFqydIDHYw1w38U8QPAj9O22lei_um8qHT092O_BoQwJfvBoLTYB803ljhIYcVxh709hmWhVFV4'
}

os.makedirs('stitch_reference/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in images.items():
    path = os.path.join('stitch_reference/images', name)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(path, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {name} ({os.path.getsize(path)} bytes)")
    except Exception as e:
        print(f"Error {name}: {e}")
