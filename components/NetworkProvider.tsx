    // import React, { useState, useEffect, createContext, useContext } from 'react';
    // import NetInfo from '@react-native-community/netinfo';

    // const NetworkContext = createContext({ isConnected: true });

    // const NetworkProvider = ({ children }:{children:any}) => {
    //   const [isConnected, setIsConnected] = useState(true);

    //   useEffect(() => {
    //     const unsubscribe = NetInfo.addEventListener(state => {
    //       setIsConnected(state.isConnected ?? true);
    //     });

    //     return () => unsubscribe();
    //   }, []);

    //   return (
    //     <NetworkContext.Provider value={{ isConnected }}>
    //       {children}
    //     </NetworkContext.Provider>
    //   );
    // };

    // export const useNetwork = () => useContext(NetworkContext);
    // export default NetworkProvider;