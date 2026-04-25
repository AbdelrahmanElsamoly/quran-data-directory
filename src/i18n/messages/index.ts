export interface Messages {
  header: {
    nav: {
      resources: string;
      about: string;
      dashboard: string;
    };
    auth: {
      login: string;
      register: string;
    };
    langSwitch: {
      ar: string;
      en: string;
    };
    mobileMenu: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      categories: string[];
    };
    cta: {
      title: string;
      subtitle: string;
      getStarted: string;
      explore: string;
    };
    featured: {
      title: string;
      browseAll: string;
      empty: string;
    };
    stats: {
      resources: string;
      publishers: string;
      developers: string;
      downloads: string;
    };
  };
  catalog: {
    title: string;
    subtitle: string;
    showing: string;
    showingSearch: string;
    empty: {
      title: string;
      subtitle: string;
    };
    filters: {
      title: string;
      type: string;
      allTypes: string;
      license: string;
      allLicenses: string;
      itqanBadge: string;
      verifiedOnly: string;
      notVerified: string;
    };
    types: {
      library: string;
      sdk: string;
      dataset: string;
      api: string;
      tafsir: string;
    };
  };
  resource: {
    itqanBadge: string;
    details: string;
    github: string;
    detail: {
      home: string;
      resources: string;
      description: string;
      information: string;
      license: string;
      type: string;
      created: string;
      updated: string;
      documentation: string;
      accessRequest: string;
      accessRequestDescription: string;
      quickSummary: string;
      status: string;
      published: string;
      itqanCertified: string;
      yes: string;
      no: string;
      relatedResources: string;
      comments: string;
      leaveAComment: string;
      authorName: string;
      post: string;
      commingSoon: string;
      noComments: string;
      requestFailed: string;
      loginToRequest: string;
      requestSent: string;
      requestReviewed: string;
      accessRequestFor: string;
      accessReason: string;
      submit: string;
      cancel: string;
    };
  };
  footer: {
    description: string;
    platform: {
      title: string;
      browse: string;
      standards: string;
      docs: string;
    };
    community: {
      title: string;
      about: string;
      contact: string;
      privacy: string;
    };
    copyright: string;
  };
  pagination: {
    of: string;
  };
}

import { ar as arMessages } from './ar';
import { en as enMessages } from './en';

export const ar = arMessages as Messages;
export const en = enMessages as Messages;

export const allMessages: Record<'ar' | 'en', Messages> = { ar, en };
