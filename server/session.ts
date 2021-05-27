let username = '';

const setUsername = (activeUsername: string) => {
  username = activeUsername;
};

const getUsername = () => username;

export const session = {
  setUsername,
  getUsername,
};
