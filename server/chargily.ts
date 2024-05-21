
import { ChargilyClient } from '@/vendor/chargily/src/classes/client';


const chargily_sk="test_sk_84hl2JihjzxatIXuLbo8AT9eibVjkA8QfUr0Stxu" ;

if (!chargily_sk) {

    throw new Error("chargily Api key is not defined");
}

const client = new ChargilyClient({
  api_key: chargily_sk,
  mode: 'test', // Change to 'live' when deploying your application
});

declare global {
    var chargily : ChargilyClient;
}

export const chargily = globalThis.chargily || client ;



