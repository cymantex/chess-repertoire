export const FetchError = ({ error }: { error: Error }) => (
  <span>An error has occurred: {error.message}</span>
);
