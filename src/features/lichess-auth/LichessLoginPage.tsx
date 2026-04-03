import { SiLichess } from "react-icons/si";
import type { AuthContextProps } from "react-oidc-context";

export const LichessLoginPage = ({ auth }: { auth: AuthContextProps }) => {
  const loading = auth.activeNavigator === "signinSilent" || auth.isLoading;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-xl rounded-box border border-base-300 bg-base-200/30 p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold">Sign in to Chess Repertoire</h1>
        </div>

        <p className="text-sm opacity-80 mb-5">
          Connect your Lichess account to continue. Only publicly available data
          is used to identify your account.
        </p>

        {auth.error && (
          <div role="alert" className="alert alert-error mb-5">
            <span className="text-sm">
              Oops... {auth.error.source} caused {auth.error.message}
            </span>
          </div>
        )}

        <button
          className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={() => auth.signinRedirect()}
        >
          {auth.activeNavigator === "signinSilent" || auth.isLoading ? (
            <span className="loading loading-spinner" />
          ) : (
            <div className="flex gap-2">
              <SiLichess />
              <span>Continue with Lichess</span>
            </div>
          )}
        </button>
      </section>
    </main>
  );
};
