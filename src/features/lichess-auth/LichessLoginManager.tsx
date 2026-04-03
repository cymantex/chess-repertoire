import { useAuth } from "react-oidc-context";
import { LichessLoginPage } from "@/features/lichess-auth/LichessLoginPage.tsx";
import type { PropsWithChildren } from "react";

export const LichessLoginManager = ({ children }: PropsWithChildren) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <section className="flex items-center gap-4">
          <span className="loading loading-spinner" />
          <h2 className="font-light text-2xl">Loading</h2>
        </section>
      </main>
    );
  }

  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  return <LichessLoginPage auth={auth} />;
};
