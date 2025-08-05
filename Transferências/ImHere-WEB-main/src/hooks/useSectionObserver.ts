import { useEffect, useState } from 'react';

export const useSectionObserver = (sectionIds: string[]) => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSection(id);
              }
            });
          },
          { threshold: 0.7 } /* Ajuste o threshold no IntersectionObserver para controlar quando a seção é considerada visível. Um valor de 0.5 significa que a seção deve estar 50% visível para ser considerada ativa. */
        );

        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds]);

  return visibleSection;
};