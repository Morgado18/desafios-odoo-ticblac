"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "Assunto",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    console.log(values);

    const mailToLink = `mailto:geral@imhere.com?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
  }

  return (
    <section id="contact" className=" bg-gray-600/5 md:w-[100%] py-24 sm:py-32">
      <div className="container">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 100
                }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.2
                }}


                className="text-3xl md:text-4xl font-bold">Fale connosco</motion.h2>
            </div>
            <motion.p
              initial={{
                opacity: 0,
                y: 100
              }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10, delay: 0.4
              }}

              className="mb-8  lg:w-5/6">
              Tem alguma dúvida, sugestão ou precisa de suporte? Nossa equipe está pronta para ajudar! Entre em contato conosco e responderemos o mais breve possível. Utilize o formulário abaixo ou envie uma mensagem pelos nossos canais de atendimento.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 100
              }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10, delay: 0.6
              }}
              className="flex flex-col gap-4">
              <div>
                <div className="flex gap-2 mb-1">
                  <Building2 className="text-blue" />
                  <div className="font-bold">Localização</div>
                </div>

                <div>Patriota, Talatona, Luanda</div>
              </div>

              <div>
                <div className="flex gap-2 mb-1">
                  <Phone className="text-blue" />
                  <div className="font-bold">Telefone</div>
                </div>

                <div>(+244)922000000</div>
              </div>

              <div>
                <div className="flex gap-2 mb-1">
                  <Mail className="text-blue" />
                  <div className="font-bold">Email</div>
                </div>

                <div>geral@imhere.com</div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10, delay: 0.4
            }}>

            <Card className="bg-white">
              <CardHeader className="text-primary text-2xl"> </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full gap-4"
                  >
                    <div className="flex flex-col md:!flex-row gap-8">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="António" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                              <Input placeholder="Miranda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="leomirandadev@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assunto</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="example@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>


                    <div className="flex flex-col gap-1.5">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Sua Mensagem..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button className="mt-4 hover:bg-opacity-7 ">Enviar</Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter></CardFooter>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
