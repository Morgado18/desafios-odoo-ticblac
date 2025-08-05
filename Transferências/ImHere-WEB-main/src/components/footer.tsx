import Image from "next/image";
import Link from "next/link";
import { aboutList, resourcesList } from "./landing/routes";
import { CardTitle } from "./ui/card";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-blue w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Container principal */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">

          {/* Seção da Logo e texto */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <Link href="/" className="mb-4">
              <div className="flex items-center">

                <Image
                  src="/logo.png"
                  width={100}
                  height={100}
                  alt=" I'm Here"
                  className="hover:scale-105 transition-transform duration-300"
                />
                <CardTitle className="text-white text-2xl font-bold">{`I'm Here`}</CardTitle>
              </div>
            </Link>
            <p className="text-white text-sm mt-2">
              O {`I'm Here`} conecta profissionais e clientes de forma rápida e segura, facilitando a contratação de serviços qualificados.
            </p>
          </div>

          {/* Links de navegação em colunas */}
          <nav className="self-center flex-1 w-full md:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center md:justify-items-end">
              {/* Quem somos? */}
              <div>
                <h3 className="text-black font-bold mb-2">Quem somos?</h3>
                <ul>
                  {aboutList.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-blue-900 underline hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Recursos */}
              <div>
                <h3 className="text-black font-bold mb-2">Recursos</h3>
                <ul>
                  {resourcesList.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-blue-900 hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Redes Sociais (placeholder) */}
              <div className="flex flex-col items-center">
                <h3 className="text-black font-bold mb-2">Redes Sociais</h3>
                <div className="flex gap-4 mt-2">
                  <Link href="#" aria-label="Instagram">
                    <Image src="/instagram.png" alt="Instagram" width={36} height={36} className="hover:scale-110 transition-transform" />
                  </Link>
                  <Link href="#" aria-label="Facebook">
                    <Image src="/facebook.png" alt="Facebook" width={36} height={36} className="hover:scale-110 transition-transform" />
                  </Link>
                  <Link href="#" aria-label="YouTube">
                    <Image src="/video.png" alt="YouTube" width={36} height={36} className="hover:scale-110 transition-transform" />
                  </Link>
                  <Link href="#" aria-label="X (Twitter)">
                    <Image src="/twitter.png" alt="X (Twitter)" width={36} height={36} className="hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Divisor e seção inferior */}
        <hr className="my-8 border-t border-white/20" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-white text-sm order-2 md:order-1">
            © 2025 {`I'm Here`}. Todos os direitos reservados.
          </div>

          <div className="flex gap-6 order-1 md:order-2">
            <Link href="/" className="text-white text-sm hover:text-primary-700">
              Política de Privacidade
            </Link>
            <Link href="/" className="text-white text-sm hover:text-primary-700">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
