import React from "react";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";
import defaultCourseImage from "../assets/images/curso1.webp";

const COURSE_IMAGE_URL = "https://mrlfgpdsoockzfdcrvwi.supabase.co/storage/v1/object/public/media/courses/61x9tou3eum_1789680473806.webp";
const TARGET_COURSE_URL = "/cursos/curso-intensivo-de-biorressonancia-pack-modulos-1-e-2";

export const FeaturedCourseBanner: React.FC = () => {
  return (
    <section className="py-24 bg-site-bg relative overflow-hidden z-0 transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        <div className="bg-surface rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-surface-border backdrop-blur-sm">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-surface-muted text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest border border-surface-border">
              Formação Completa · Online e Presencial
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-site-text leading-tight">
                Curso Intensivo de Biorressonância
              </h2>
              <p className="text-lg font-bold text-secondary">
                Aplicada à Prática Clínica — Módulos 1 + 2
              </p>
            </div>

            <p className="text-base lg:text-lg text-site-text-muted leading-relaxed font-light">
              Uma formação completa, dos fundamentos à aplicação prática, para profissionais de saúde que pretendem compreender e aprofundar a Biorressonância e integrar uma abordagem mais estruturada e individualizada na sua prática clínica.
            </p>

            <ul className="space-y-3.5 pt-1">
              <li className="flex items-start gap-3 text-site-text font-medium leading-relaxed text-sm lg:text-base">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span><strong className="text-site-text font-bold">Formação completa:</strong> 6 dias de formação, divididos em dois módulos complementares — online e presencial.</span>
              </li>
              <li className="flex items-start gap-3 text-site-text font-medium leading-relaxed text-sm lg:text-base">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span><strong className="text-site-text font-bold">Dos fundamentos à prática:</strong> avaliação, testagem, interpretação, definição de prioridades e personalização da abordagem.</span>
              </li>
              <li className="flex items-start gap-3 text-site-text font-medium leading-relaxed text-sm lg:text-base">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span><strong className="text-site-text font-bold">Não é necessário possuir equipamento:</strong> a formação é adequada tanto para quem já trabalha com Biorressonância como para quem pretende começar.</span>
              </li>
            </ul>

            {/* Datas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs lg:text-sm font-semibold text-site-text bg-surface-muted/60 p-3 rounded-xl border border-surface-border">
                <Calendar className="w-4 h-4 text-secondary shrink-0" />
                <span>Módulo 1: 14, 15 e 16 NOV 2026 | Online</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs lg:text-sm font-semibold text-site-text bg-surface-muted/60 p-3 rounded-xl border border-surface-border">
                <Calendar className="w-4 h-4 text-secondary shrink-0" />
                <span>Módulo 2: 23, 24 e 25 JAN 2027 | Presencial - Lisboa</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to={TARGET_COURSE_URL}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 uppercase tracking-wider text-sm"
              >
                <span>CONHEÇA A FORMAÇÃO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-border bg-primary/5">
              <OptimizedImage
                src={COURSE_IMAGE_URL || defaultCourseImage}
                alt="Curso Intensivo de Biorressonância"
                className="w-full h-auto block transform hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Aliases para compatibilidade
export { FeaturedCourseBanner as BioReset };
export default FeaturedCourseBanner;
