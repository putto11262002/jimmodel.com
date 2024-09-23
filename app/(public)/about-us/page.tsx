import Container from "@/components/container";
import TitleContentLayout from "@/components/layouts/title-content-layout";
export const metadata = {
  title: "About Us",
};

export default function Page() {
  return (
    <Container max="md" className="text-justify">
      <TitleContentLayout
        title={
          <h1 className="text-xl md:text-2xl font-bold text-center">
            About Us
          </h1>
        }
      >
        <div className="space-y-3 indent-4 text-sm md:text-base">
          <p>
            J.I.M. Modeling Agency, Ltd. was founded in 1984 by Sukumaporn S.
            (Jim), a veteran in the modeling and fashion industry. Having built
            our reputation for more than two decades, we are one of the most
            highly regarded modeling agencies in Thailand.
          </p>
          <p>
            In an effort to build lasting relationships, our staff tailor their
            services to meet the needs of individual models and clients. There
            is no need to brag about our exceptional commitment to the modeling
            industry, because it is evident to everyone who works with us.
          </p>
          <p>
            J.I.M. is proud to represent the best local and international models
            and talent, many of whom are under our exclusive management. We
            would be glad to represent you as well.
          </p>
          <p>
            For our clients, we offer a comprehensive selection of models and
            talent — both children and adults - for print and television
            advertisements. The agency works closely with clients throughout
            Asia and all over the world. Our international scouts seek fresh
            faces and new talent in Asia and overseas in such places as Canada,
            U.S.A., Europe, Brazil and Asia as Japan, Korea, Singapore, China
            and Hong Kong.
          </p>
          <p>
            Whether you are new to the modeling world, a seasoned pro, or a
            potential client, our years of experience and good name can open
            doors for you. Thank you for considering J.I.M. Modeling Agency.
          </p>
        </div>
      </TitleContentLayout>
    </Container>
  );
}
