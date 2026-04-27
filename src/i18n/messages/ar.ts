export const ar = {
  // Header
  header: {
    nav: {
      resources: 'الموارد',
      about: 'حول',
      dashboard: 'لوحة التحكم',
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    langSwitch: {
      ar: 'عربي',
      en: 'English',
    },
    mobileMenu: 'القائمة',
  },

  // Home page
  home: {
    hero: {
      title: 'اكتشف موارد تطوير البرمجيات القرآنية',
      subtitle:
        'المصدر الشامل للمكتبات وأدوات التطوير والمجموعات البيانات وواجهات البرمجة والمراجع العلمية المخصصة لتطوير البرمجيات القرآنية.',
      categories: ['مكتبات', 'أدوات تطوير', 'مجموعات بيانات', 'واجهات برمجة', 'تفاسير'],
    },
    cta: {
      title: 'انشر موردك القرآني',
      subtitle:
        'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع. وصل إلى المطورين الذين يبنيون الجيل القادم من البرمجيات القرآنية.',
      getStarted: 'ابدأ الآن',
      explore: 'استكشف الموارد',
    },
    featured: {
      title: 'موارد مميزة',
      browseAll: 'تصفح الكل',
      empty: 'لا توجد موارد مميزة بعد.',
    },
    stats: {
      resources: 'موارد',
      publishers: 'منشرون',
      developers: 'مطورون',
      downloads: 'تحميلات',
    },
  },

  // Catalog page
  catalog: {
    title: 'الموارد',
    subtitle: 'اكتشف المكتبات وأدوات التطوير ومجموعات البيانات وواجهات البرمجة والمراجع العلمية لتطوير البرمجيات القرآنية.',
    showing: 'عرض {{count}} من {{total}} مورد',
    showingSearch: 'عرض {{count}} من {{total}} مورد لـ "{{query}}"',
    empty: {
      title: 'لم يتم العثور على موارد',
      subtitle: 'حاول تعديل الفلاتر أو البحث.',
    },
    filters: {
      title: 'الفلاتر',
      type: 'النوع',
      allTypes: 'جميع الأنواع',
      license: 'الترخيص',
      allLicenses: 'الكل',
      itqanBadge: 'موثق بإتقان',
      verifiedOnly: 'موثق فقط',
      notVerified: 'غير موثق',
    },
    types: {
      library: 'مكتبة',
      sdk: 'أداة تطوير',
      dataset: 'مجموعة بيانات',
      api: 'واجهة برمجة',
      tafsir: 'تفسير',
      audio: 'صوت',
      pdf: 'PDF',
      json: 'JSON',
    },
  },

  // Resource card
  resource: {
    itqanBadge: '★ إتقان',
    details: 'التفاصيل',
    github: 'GitHub',
    detail: {
      home: 'الرئيسية',
      resources: 'الموارد',
      description: 'الوصف',
      information: 'المعلومات',
      license: 'الرخصة',
      type: 'النوع',
      created: 'تاريخ الإنشاء',
      updated: 'آخر تحديث',
      documentation: 'التوثيق',
      accessRequest: 'طلب الوصول',
      accessRequestDescription: 'هل تحتاج إلى الوصول إلى هذا المورد؟ أرسل طلباً وسيتم مراجعته من قبل الناشر.',
      quickSummary: 'ملخص سريع',
      status: 'الحالة',
      published: 'منشور',
      itqanCertified: 'شهادة إتقان',
      yes: 'نعم ★',
      no: 'لا',
      // Report
      report: 'إبلاغ',
      reportTooltip: 'إبلاغ عن هذا المورد',
      reportModalTitle: 'إبلاغ عن هذا المورد',
      reportReason: 'السبب',
      reportReasonInaccurate: 'غير دقيق',
      reportReasonInappropriate: 'غير لائق',
      reportReasonInfringing: 'انتهاك حقوق',
      reportReasonSpam: 'مزعج',
      reportReasonOutdated: 'عفا عليه الزمن',
      reportReasonBrokenLink: 'رابط معطل',
      reportDetails: 'تفاصيل (اختياري)',
      reportSubmit: 'إرسال الإبلاغ',
      reportCancel: 'إلغاء',
      reportSuccess: 'تم إرسال الإبلاغ بنجاح',
      reportError: 'فشل إرسال الإبلاغ. يرجى المحاولة مرة أخرى.',
      reportDuplicate: 'لقد قمت بالإبلاغ عن هذا المورد من قبل.',
      // Preview
      preview: 'معاينة',
      previewUnavailable: 'المعاينة غير متاحة لهذا المورد',
      previewCollapse: 'طي المعاينة',
      previewExpand: 'توسيع المعاينة',
      previewApiEndpoint: 'نقطة النهاية',
      previewApiTryIt: 'جربه',
      previewSdkInstall: 'تثبيت',
      previewSdkCopied: 'تم النسخ!',
      previewDatasetRows: 'صفوف',
      previewDatasetColumns: 'أعمدة',
      previewDatasetSize: 'الحجم',
      previewJsonFormat: 'JSON مُنسق',
      relatedResources: 'موارد ذات صلة',
      comments: 'التعليقات',
      leaveAComment: 'أضف تعليقاً...',
      authorName: 'اسمك',
      post: 'نشر',
      commingSoon: '※ التعليقات ستتوفر قريباً مع الخلفية الخلفية',
      noComments: 'لا توجد تعليقات بعد',
      requestFailed: 'فشل في إرسال الطلب. حاول مرة أخرى.',
      loginToRequest: 'تسجيل الدخول لطلب الوصول',
      loginToReport: 'تسجيل الدخول للإبلاغ',
      requestSent: 'تم إرسال طلب الوصول بنجاح',
      requestReviewed: 'سيتم مراجعة طلبك قريباً',
      accessRequestFor: 'طلب الوصول لـ',
      accessReason: 'اشرح سبب حاجتك للوصول إلى هذا المورد...',
      submit: 'إرسال',
      cancel: 'إلغاء',
    },
  },

  // Footer
  footer: {
    description:
      'منصة مجتمعية لاكتشاف وتوزيع وإدارة موارد تطوير البرمجيات القرآنية. تمكين المطورين والنشرين بسوق موثوق ومختار بعناية.',
    platform: {
      title: 'المنصة',
      browse: 'تصفح الموارد',
      standards: 'معايير الإتقان',
      docs: 'التوثيق',
    },
    community: {
      title: 'المجتمع',
      about: 'حولنا',
      contact: 'تواصل معنا',
      privacy: 'سياسة الخصوصية',
    },
    copyright: '© {{year}} منصة RATQ المجتمعية. جميع الحقوق محفوظة.',
  },

  // Pagination
  pagination: {
    of: 'من',
  },
};
