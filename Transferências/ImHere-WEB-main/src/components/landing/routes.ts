type RouteProps = {
  href: string;
  label: string;
}

export const routeList: RouteProps[] = [
  { href: "/#how-it-works", label: "Como funciona" },
  { href: "/#join", label: "Junte-se" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contacto" },
  { href: "/our-service-providers", label: "Encontre Profissionais" },
];

export const aboutList: RouteProps[] = [
  { href: "/#", label: "Sobre nós" },
  { href: "/#", label: "Contacto" },
  { href: "/#", label: "Política de privacidade" },
  { href: "/#", label: "Termos de serviço" },
  { href: "/#", label: "Configuração de cookie" },
];

export const resourcesList: RouteProps[] = [
  { href: "/#", label: "Central de ajuda" },
  { href: "/#", label: "Tutoriais para clientes" },
  { href: "/#", label: "Empresas" },
  { href: "/#", label: "Mapa do Site" },
  { href: "/#", label: "Suporte Técnico" },
];
