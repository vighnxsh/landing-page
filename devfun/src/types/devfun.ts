export interface DevFunUser {
  uniqueId: string;
  username: string | null;
  displayName: string;
  avatar: string | null;
  solanaWallet: string;
}

export interface DevFunToken {
  name: string;
  symbol: string;
  marketcap: number;
  image: string;
  website: string;
  twitter: string | null;
  contractAddress: string;
  volumeIn24h: number;
  bondingCurveProgress: number;
  priceChangeIn24h: number;
}

export interface DevFunProject {
  id: string;
  name: string;
  description: string;
  oneliner: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  twitter: string | null;
  website: string;
  telegram: string | null;
  runsCount: number;
  likesCount: number;
  appCount: number;
  user: DevFunUser;
  token: DevFunToken | null;
}

export interface DevFunFeaturedResponse {
  result: {
    data: {
      json: DevFunProject[];
      meta: {
        values: Record<string, string[]>;
      };
    };
  };
}

export interface DevFunProjectDetailUser {
  id: string;
  uniqueId: string;
  username: string | null;
  displayName: string;
  avatar: string | null;
}

export interface DevFunProjectDetailToken extends DevFunToken {}

export interface DevFunProjectDetail {
  id: string;
  isMyProject: boolean;
  name: string;
  description: string;
  oneliner: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  twitter: string | null;
  discord: string | null;
  website: string;
  telegram: string | null;
  subdomain: string | null;
  domainExpiredAt: string | null;
  hideBranding: boolean;
  user: DevFunProjectDetailUser;
  token: DevFunProjectDetailToken | null;
  runsCount: number;
  likesCount: number;
  appCount: number;
}

export interface DevFunGetProjectResponse {
  result: {
    data: {
      json: DevFunProjectDetail;
      meta: {
        values: Record<string, string[]>;
      };
    };
  };
}

// App detail
export interface DevFunAppDetailUser {
  id: string;
  uniqueId: string;
  username: string | null;
  solanaWallet: string;
  displayName: string;
  bio: string;
  avatar: string | null;
}

export interface DevFunAppDetailToken extends DevFunToken {
  price?: number;
  devCount?: number;
  appCount?: number;
  runsCount?: number;
}

export interface DevFunAppDetail {
  id: string;
  isMyApp: boolean;
  projectId: string;
  name: string;
  description: string;
  brief: string;
  website?: string;
  isLive: boolean;
  isPublic: boolean;
  tags: string[];
  cover: string;
  cdnUrl: string;
  createdAt: string;
  updatedAt: string;
  lastCommitId: string;
  tier: number;
  credits: number;
  user: DevFunAppDetailUser;
  commitCount: number;
  forkCount: number;
  likeCount: number;
  runsCount: number;
  downvoteCount: number;
  upvoteCount: number;
  upvoteRate: number;
  commentCount: number;
  reportCount: number;
  visitorCount: number;
  isArchived: boolean;
  isRenamed: boolean;
  contractAddress: string;
  code: string;
  packageJson: string;
  appFunctions: unknown[];
  token: DevFunAppDetailToken;
  upstreamApp: unknown | null;
  isLordOfDev: boolean;
  analytics: { day: string; runCount: number }[];
  snapshot: string;
  ogImage: string;
  isDevbase: boolean;
  project: {
    id: string;
    image: string;
    name: string;
    oneliner: string;
    description: string;
  };
}

export interface DevFunGetAppResponse {
  result: {
    data: {
      json: DevFunAppDetail;
    };
  };
}

// App commits
export interface DevFunCommitItem {
  id: string;
  appId: string;
  createdAt: string;
  prompt: string;
  completed: boolean;
  snapshot: string;
}

export interface DevFunGetAppCommitsResponse {
  result: {
    data: {
      json: DevFunCommitItem[];
    };
  };
}

// App extensions
export interface DevFunExtensionItem {
  id: string;
  priority: number;
  title: string;
  description: string;
  status: 'in-use' | 'enabled' | 'disabled';
}

export interface DevFunGetAppExtensionsResponse {
  result: {
    data: {
      json: DevFunExtensionItem[];
    };
  };
}

// Legacy interfaces for backward compatibility
export interface DevFunApp {
  id: string;
  name: string;
  description: string;
  website?: string;
  cover: string;
  createdAt: string;
  category: string;
  tags: string[];
  user: DevFunUser;
  token: DevFunToken | null;
  commitCount: number;
  forkCount: number;
  likeCount: number;
  runsCount: number;
  commentCount: number;
  upvoteRate: number;
  upvoteCount: number;
  downvoteCount: number;
  isLordOfDev: boolean;
}

export interface DevFunApiResponse {
  result: {
    data: {
      json: {
        items: DevFunApp[];
        nextCursor: string | null;
      };
      meta: {
        values: Record<string, string[]>;
      };
    };
  };
}

