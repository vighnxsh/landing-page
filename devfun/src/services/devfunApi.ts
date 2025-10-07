import { DevFunApiResponse, DevFunApp, DevFunProject, DevFunFeaturedResponse, DevFunGetAppResponse, DevFunGetAppCommitsResponse, DevFunGetAppExtensionsResponse, DevFunCommitItem, DevFunExtensionItem, DevFunAppDetail, DevFunGetProjectResponse, DevFunProjectDetail } from '@/types/devfun';

const DEV_FUN_API_BASE = 'https://dev.fun/api';

export interface DevFunApiParams {
  limit?: number;
  search?: string;
  sortBy?: 'created_on' | 'runs' | 'likes' | 'marketcap';
  sortOrder?: 'asc' | 'desc';
  type?: 'featured' | 'all';
  category?: string;
  direction?: 'forward' | 'backward';
  cursor?: string;
}

export class DevFunApiService {
  private static buildUrl(params: DevFunApiParams = {}): string {
    const defaultParams: DevFunApiParams = {
      limit: 20,
      search: '',
      sortBy: 'created_on',
      sortOrder: 'desc',
      type: 'featured',
      category: '',
      direction: 'forward',
      ...params,
    };

    const input = {
      json: {
        limit: defaultParams.limit,
        search: defaultParams.search,
        sortBy: defaultParams.sortBy,
        sortOrder: defaultParams.sortOrder,
        type: defaultParams.type,
        category: defaultParams.category,
        _refreshKey: new Date().toISOString(),
        direction: defaultParams.direction,
        ...(defaultParams.cursor && { cursor: defaultParams.cursor }),
      },
    };

    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/home.listApps?input=${encodedInput}`;
  }

  private static buildFeaturedUrl(): string {
    const input = {
      json: null,
      meta: {
        values: ["undefined"]
      }
    };
    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/project.getFeatured?input=${encodedInput}`;
  }

  private static buildGetAppUrl(id: string): string {
    const input = { json: { id } };
    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/app.getApp?input=${encodedInput}`;
  }

  private static buildGetAppCommitsUrl(appId: string): string {
    const input = { json: { appId } };
    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/app.getAppCommits?input=${encodedInput}`;
  }

  private static buildGetAppExtensionsUrl(appId: string): string {
    const input = { json: { appId } };
    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/app.getAppExtensions?input=${encodedInput}`;
  }

  private static buildGetProjectUrl(id: string): string {
    const input = { json: { id } };
    const encodedInput = encodeURIComponent(JSON.stringify(input));
    return `${DEV_FUN_API_BASE}/project.getProject?input=${encodedInput}`;
  }

  static async fetchApps(params: DevFunApiParams = {}): Promise<DevFunApp[]> {
    try {
      const url = this.buildUrl(params);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunApiResponse = await response.json();
      return data.result.data.json.items;
    } catch (error) {
      console.error('Error fetching apps from dev.fun API:', error);
      throw new Error('Failed to fetch apps from dev.fun');
    }
  }

  static async fetchFeaturedProjects(): Promise<DevFunProject[]> {
    try {
      const url = this.buildFeaturedUrl();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunFeaturedResponse = await response.json();
      // Return all featured projects (grid handles layout)
      return data.result.data.json;
    } catch (error) {
      console.error('Error fetching featured projects from dev.fun API:', error);
      throw new Error('Failed to fetch featured projects from dev.fun');
    }
  }

  static async fetchFeaturedApps(): Promise<DevFunApp[]> {
    return this.fetchApps({ type: 'featured' });
  }

  static async searchApps(query: string): Promise<DevFunApp[]> {
    return this.fetchApps({ search: query, type: 'all' });
  }

  static async fetchAppsByCategory(category: string): Promise<DevFunApp[]> {
    return this.fetchApps({ category, type: 'all' });
  }

  static async fetchAppById(id: string): Promise<DevFunAppDetail> {
    try {
      const url = this.buildGetAppUrl(id);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunGetAppResponse = await response.json();
      return data.result.data.json;
    } catch (error) {
      console.error('Error fetching app by id from dev.fun API:', error);
      throw new Error('Failed to fetch app');
    }
  }

  static async fetchAppCommits(appId: string): Promise<DevFunCommitItem[]> {
    try {
      const url = this.buildGetAppCommitsUrl(appId);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunGetAppCommitsResponse = await response.json();
      const all = data.result.data.json || [];
      // Ensure newest first, then take latest 3 only
      const sorted = [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return sorted.slice(0, 3);
    } catch (error) {
      console.error('Error fetching app commits from dev.fun API:', error);
      throw new Error('Failed to fetch app commits');
    }
  }

  static async fetchAppExtensions(appId: string): Promise<DevFunExtensionItem[]> {
    try {
      const url = this.buildGetAppExtensionsUrl(appId);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunGetAppExtensionsResponse = await response.json();
      return data.result.data.json;
    } catch (error) {
      console.error('Error fetching app extensions from dev.fun API:', error);
      throw new Error('Failed to fetch app extensions');
    }
  }

  static async fetchProjectById(id: string): Promise<DevFunProjectDetail> {
    try {
      const url = this.buildGetProjectUrl(id);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DevFunGetProjectResponse = await response.json();
      return data.result.data.json;
    } catch (error) {
      console.error('Error fetching project by id from dev.fun API:', error);
      throw new Error('Failed to fetch project');
    }
  }
}

