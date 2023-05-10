import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";

function useLocalCart() {
  const [cookie, setCookie] = useState<string | undefined>(undefined);

  const { mutate: createCart } = api.cart.createTempCart.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("toshiCart", data.id);
      setCookie(data.id);
    },
  });

  const { mutate: checkCookie } = api.cart.isCookieValid.useMutation({
    onSuccess: (data) => {
      if (data.valid) {
        setCookie(data.id);
        return;
      }
      createCart();
    },
  });

  const set = useCallback(() => {
    if (cookie) return;

    const localCart = localStorage.getItem("toshiCart");
    if (localCart) {
      return checkCookie({ id: localCart });
    }

    createCart();
  }, [checkCookie, cookie, createCart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (cookie) return;
    set();
  }, [cookie, set]);

  return { cookieId: cookie };
}

export default useLocalCart;
