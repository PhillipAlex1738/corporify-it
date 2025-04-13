
import ContactForm from "@/components/support/ContactForm";
import SupportInfo from "@/components/support/SupportInfo";
import SupportPageLayout from "@/components/support/SupportPageLayout";

const Support = () => {
  return (
    <SupportPageLayout>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <div>
          <SupportInfo />
        </div>
      </div>
    </SupportPageLayout>
  );
};

export default Support;
