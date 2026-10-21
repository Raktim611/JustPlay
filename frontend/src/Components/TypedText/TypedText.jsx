
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function TypedText({strings}){
  const typedElement = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1500,
      loop: true,
      contentType:'html',
      showCursor: false,
      // cursorChar: '|',
    });

    return () => typed.destroy();
  }, []);

  return <span ref={typedElement} />;
}
