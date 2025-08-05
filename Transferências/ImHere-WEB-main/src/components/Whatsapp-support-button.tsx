import Image from "next/image";

export function WhatsappSupportButton() {
  return (
    <a
      href="https://wa.me/9000000000" //TODO: Change to the whatsapp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 flex flex-col items-center gap-1 right-6 md:right-10 bottom-24"
      style={{ textDecoration: "none" }}
    >
      <div className="rounded-full p-3 shadow-lg flex items-center justify-center">
        <Image src="/whatsapp.png" alt="WhatsApp" width={64} height={64} />
      </div>
      <span className=" text-gray-400 mt-1">Serviço de apoio</span>
    </a>
  );
}