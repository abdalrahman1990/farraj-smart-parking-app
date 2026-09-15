const FALLBACK = {
  low_bal_text: { en: 'Insufficient wallet balance. Please recharge.', ar: 'رصيد المحفظة غير كافٍ. يرجى الشحن.' },
  please_select_time: { en: 'Please select a valid start and end time', ar: 'يرجى اختيار وقت بداية ونهاية صالح' },
  please_select_vehicle: { en: 'Please select a vehicle', ar: 'يرجى اختيار مركبة' },
  please_select_spot: { en: 'Please select a parking spot', ar: 'يرجى اختيار موقف' },
  review_booking: { en: 'Please review and confirm your booking', ar: 'يرجى مراجعة الحجز وتأكيده' },
  proceed_spot: { en: 'Please choose your parking spot', ar: 'يرجى اختيار موقف السيارة' },
  mall_is_closed: { en: 'Location is closed at this time', ar: 'الموقع مغلق في هذا الوقت' },
  booking_failed: { en: 'Booking failed. Please try again.', ar: 'فشل الحجز. يرجى المحاولة مرة أخرى.' },
  booking_confirmed_text: { en: 'Booking confirmed successfully', ar: 'تم تأكيد الحجز بنجاح' },
  spots_failed: { en: 'Could not load parking spots', ar: 'تعذر تحميل المواقف' },
  led_blinking: { en: 'Spot light blinking…', ar: 'ضوء الموقف يومض…' },
  gate_failed: { en: 'Could not reach the device. Please try again.', ar: 'تعذر الاتصال بالجهاز. يرجى المحاولة مرة أخرى.' },
  gate_opened: { en: 'Gate opening…', ar: 'جارٍ فتح البوابة…' },
  request_sent: { en: 'Your request has been sent successfully', ar: 'تم ارسال طلبك بنجاح' },
  generic_error: { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
  no_records: { en: 'No records found', ar: 'لا توجد سجلات' },
  delete_confirm: { en: 'Delete this notification?', ar: 'حذف هذا الإشعار؟' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  delete: { en: 'Delete', ar: 'حذف' },
  fill_fields: { en: 'Please enter your email and password', ar: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
  welcome_back: { en: 'Welcome back!', ar: 'مرحباً بعودتك!' },
  invalid_login: { en: 'Invalid email or password', ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
  network_error: { en: 'Network error. Please try again.', ar: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.' },
  account_created: { en: 'Account created successfully', ar: 'تم إنشاء الحساب بنجاح' },
  account_exists: { en: 'An account with this email already exists', ar: 'يوجد حساب بهذا البريد الإلكتروني بالفعل' },
  check_fields: { en: 'Please fill all fields with a valid email', ar: 'يرجى ملء جميع الحقول ببريد صالح' },
};

export const tmsg = (lables, lang, key) => {
  const direct = lables?.[key];
  if (direct) return direct;
  const fb = FALLBACK[key];
  if (!fb) return key;
  return lang === 'ar' ? fb.ar : fb.en;
};
