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
      logout: string;
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
      audio: string;
      pdf: string;
      json: string;
    };
  };
  resource: {
    itqanBadge: string;
    details: string;
    github: string;
    version: string;
    githubStats: {
      title: string;
      stars: string;
      forks: string;
      openIssues: string;
      lastCommit: string;
      viewOnGithub: string;
      statsUnavailable: string;
    };
    detail: {
      home: string;
      resources: string;
      description: string;
      information: string;
      license: string;
      type: string;
      created: string;
      updated: string;
      version: string;
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
      loginToReport: string;
      requestSent: string;
      requestReviewed: string;
      accessRequestFor: string;
      accessReason: string;
      submit: string;
      cancel: string;
      // Report
      report: string;
      reportTooltip: string;
      reportModalTitle: string;
      reportReason: string;
      reportReasonInaccurate: string;
      reportReasonInappropriate: string;
      reportReasonInfringing: string;
      reportReasonSpam: string;
      reportReasonOutdated: string;
      reportReasonBrokenLink: string;
      reportDetails: string;
      reportSubmit: string;
      reportCancel: string;
      reportSuccess: string;
      reportError: string;
      reportDuplicate: string;
      // Preview
      preview: string;
      previewUnavailable: string;
      previewCollapse: string;
      previewExpand: string;
      previewApiEndpoint: string;
      previewApiTryIt: string;
      previewSdkInstall: string;
      previewSdkCopied: string;
      previewDatasetRows: string;
      previewDatasetColumns: string;
      previewDatasetSize: string;
      previewJsonFormat: string;
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
  about: {
    pageTitle: string;
    why: {
      paragraph1: string;
      paragraph2: string;
    };
    whatIs: {
      paragraph1: string;
      paragraph2Before: string;
      paragraph2After: string;
      standards: string;
    };
    offer: {
      title: string;
      items: {
        catalog: { title: string; description: string };
        verification: { title: string; description: string };
        access: { title: string; description: string };
        community: { title: string; description: string };
        tools: { title: string; description: string };
      };
    };
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
}

import { ar as arMessages } from './ar';
import { en as enMessages } from './en';

export const ar = arMessages as Messages;
export const en = enMessages as Messages;

export const allMessages: Record<'ar' | 'en', Messages> = { ar, en };
