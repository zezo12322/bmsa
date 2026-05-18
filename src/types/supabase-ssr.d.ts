declare module '@supabase/ssr' {
  export type CookieToSet = {
    name: string;
    value: string;
    options?: object;
  };

  export type SupabaseError = {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  };

  export type ServerSupabaseClient = {
    auth: {
      getUser(): Promise<{ data: { user: { id: string; email?: string } | null }; error: SupabaseError | null }>;
      signInWithPassword(credentials: {
        email: string;
        password: string;
      }): Promise<{ error: SupabaseError | null }>;
      signOut(): Promise<{ error: SupabaseError | null }>;
    };
    rpc<T = unknown>(
      functionName: string,
      args?: Record<string, unknown>
    ): Promise<{ data: T | null; error: SupabaseError | null }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from(table: string): any;
  };

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        getAll(): { name: string; value: string }[];
        setAll?(cookiesToSet: CookieToSet[]): void;
      };
    }
  ): ServerSupabaseClient;
}
