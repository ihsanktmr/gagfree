import NetInfo from "@react-native-community/netinfo";

export function isConnected() {
  return new Promise<void>((resolve, reject) => {
    NetInfo.fetch().then((state: { isConnected: any }) => {
      if (state.isConnected) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export function setupConnectivityListener(
  callback: (isConnected: boolean) => void,
): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    callback(state.isConnected || false);
  });

  // Return the unsubscribe function to stop the listener when needed
  return unsubscribe;
}
