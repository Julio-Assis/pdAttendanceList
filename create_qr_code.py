import qrcode

def test_generate_qr_code():
  qr = qrcode.QRCode(
      version=1,
      error_correction=qrcode.constants.ERROR_CORRECT_Q,
      box_size=10,
      border=4,
  )
  qr.add_data('https://pd-sign-up-form.web.app/')
  qr.make(fit=True)

  image = qr.make_image(fill_color="blue", back_color="white")
  image.save('medium-personal-color.png')

test_generate_qr_code()
