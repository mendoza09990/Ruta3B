import React, { useEffect } from "react";

export const ComentarioFacebook = ({ theid }) => {
  useEffect(() => {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = `restaurante-${theid}`;
          this.page.url = `https://ruta-3b.disqus.com/ruta-comida/${theid}`;
          this.page.title = `Comentarios sobre restaurante ${theid}`;
        },
      });
    } else {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://ruta-3b.disqus.com/embed.js";
      s.setAttribute("data-timestamp", +new Date());
      s.async = true;
      (d.head || d.body).appendChild(s);
    }
  }, [theid]);

  return <div id="disqus_thread" style={{ marginTop: "2rem" }} />;
};
