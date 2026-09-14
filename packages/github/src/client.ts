import { Octokit } from "octokit";

export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async getRepository(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.get({ owner, repo });
    return data;
  }

  async getRepositoryLanguages(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.listLanguages({ owner, repo });
    return data; // returns Record<string, number>
  }

  async getRepositoryFile(owner: string, repo: string, path: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({ owner, repo, path });
      if (Array.isArray(data) || data.type !== "file") return null;
      return Buffer.from(data.content, "base64").toString("utf8");
    } catch (error) {
      return null;
    }
  }

  async getUserRepositories() {
    // Note: for production we should handle pagination
    const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
      visibility: "public",
      per_page: 100,
    });
    return data;
  }
}
