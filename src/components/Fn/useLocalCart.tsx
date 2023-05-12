import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";

function useLocalCart() {
  const { data: session } = useSession();

  const [cookie, setCookie] = useState<string | undefined>(undefined);

  const { mutate: createCart } = api.cart.createTempCart.useMutation({
    onSuccess: (data) => {
      if (session) return;
      console.log(session, 3);
      localStorage.setItem("toshiCart", data.id);
      setCookie(data.id);
    },
  });

  const { mutate: checkCookie } = api.cart.isCookieValid.useMutation({
    onSuccess: (data) => {
      if (session) return;
      console.log(session, 2);
      if (data.valid) {
        setCookie(data.id);
        return;
      }
      createCart();
    },
  });

  const set = useCallback(() => {
    if (session) return;
    if (cookie) return;
    console.log(session, 1);

    const localCart = localStorage.getItem("toshiCart");
    if (localCart) {
      return checkCookie({ id: localCart });
    }

    createCart();
  }, [checkCookie, cookie, createCart, session]);

  useEffect(() => {
    if (!window) return;
    if (session) return;
    if (cookie) return;
    set();
  }, [cookie, set, session]);

  return { cookieId: cookie };
}

export default useLocalCart;
