import { SettingsMenuAlert } from "@/features/sidebar/settings/SettingsMenuAlert.tsx";
import { SettingsMenuButton } from "@/features/sidebar/settings/SettingsMenuButton.tsx";
import { useAuth } from "react-oidc-context";
import { SiLichess } from "react-icons/si";
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
import { useLichessAccountQuery } from "@/features/lichess-auth/useLichessAccountQuery.ts";

export const LichessLogoutSettings = () => {
  const auth = useAuth();
  const {
    data: username,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useLichessAccountQuery();

  return (
    <>
      <SettingsMenuAlert title="Lichess account" />
      <div className="rounded-lg border border-base-300 bg-base-200/40 p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-2xl text-neutral">
            <SiLichess aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="mb-1 text-xs text-base-content/60">Signed in as</p>
            {username ? (
              <a
                href={`https://lichess.org/@/${encodeURIComponent(username)}`}
                target="_blank"
                rel="noreferrer"
                title={`View ${username} on Lichess (opens in a new tab)`}
                className="inline-flex max-w-full items-center gap-2 rounded font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="truncate">{username}</span>
                <FaExternalLinkAlt
                  aria-hidden="true"
                  className="shrink-0 text-xs text-base-content/50"
                />
              </a>
            ) : isPending ? (
              <span className="flex items-center gap-2 text-sm text-base-content/60">
                <span
                  aria-hidden="true"
                  className="loading loading-spinner loading-xs"
                />
                Loading account…
              </span>
            ) : (
              <p className="text-sm">Account details unavailable</p>
            )}
          </div>
        </div>
        {isError && (
          <div className="mt-3 flex items-center justify-between gap-3 text-xs">
            <p className="text-base-content/60">
              Couldn’t load your Lichess profile.
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-sm normal-case focus-visible:outline-accent"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Retry
            </button>
          </div>
        )}
        <div className="mt-3 border-t border-base-300 pt-3">
          <SettingsMenuButton
            type="button"
            className="!mb-0 min-h-11 gap-2 rounded-lg border-base-300 bg-base-100 text-sm font-medium normal-case shadow-none hover:border-accent/50 hover:bg-base-200 focus-visible:outline-accent"
            onClick={() => auth.removeUser()}
          >
            <FaSignOutAlt aria-hidden="true" className="text-neutral" />
            Sign out
          </SettingsMenuButton>
        </div>
      </div>
    </>
  );
};
