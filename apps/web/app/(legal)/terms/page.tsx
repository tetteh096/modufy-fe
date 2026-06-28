import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/features/legal/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Service | Modufy",
  description: "The terms that govern your use of Modufy.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      lastUpdated="10 June 2026"
      intro={
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are a legal agreement between you and
          Modufy (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) governing your use of the
          Modufy web application, websites, and related services (together, the
          &ldquo;Service&rdquo;). By creating an account or using the Service, you agree to
          these Terms. If you do not agree, do not use the Service.
        </p>
      }
    >
      <LegalSection number={1} title="What Modufy is">
        <p>
          Modufy is a business management platform that helps businesses manage customers,
          sales, invoices, expenses, accounting records, inventory, and online storefronts.
          The Service is designed primarily for businesses operating in Ghana, with support
          for Ghana Cedi (GHS) pricing, VAT handling, and mobile money payment records.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Eligibility">
        <p>
          You must be at least 18 years old and capable of entering into a binding contract
          to use the Service. If you use the Service on behalf of a business, you confirm
          that you have authority to bind that business to these Terms, and &ldquo;you&rdquo;
          includes that business.
        </p>
      </LegalSection>

      <LegalSection number={3} title="Your account">
        <ol>
          <li>
            You must provide accurate information when registering and keep it up to date.
          </li>
          <li>
            You are responsible for safeguarding your password and any two-factor
            authentication credentials. Notify us immediately if you suspect unauthorised
            access.
          </li>
          <li>
            Each business workspace belongs to the business that created it. Workspace
            owners control which team members may access the workspace and what permissions
            they hold. You are responsible for the actions of users you invite.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={4} title="Your data and our role">
        <ol>
          <li>
            <strong>You own your business data.</strong> Customer records, invoices, sales,
            expenses, inventory, and accounting entries that you enter into the Service
            belong to you or your business.
          </li>
          <li>
            We process that data only to provide the Service, as described in our Privacy
            Policy.
          </li>
          <li>
            You are responsible for the accuracy and lawfulness of the data you enter,
            including obtaining any consent needed to store your customers&apos; personal
            information in the Service.
          </li>
          <li>
            You may export your data at any time using the features provided. On account
            closure, we will delete or anonymise your data within a reasonable period,
            except where the law requires us to retain it.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={5} title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>
            use the Service for any unlawful purpose, including fraud, money laundering, or
            tax evasion;
          </li>
          <li>attempt to access another business&apos;s workspace or data;</li>
          <li>
            probe, scan, or test the vulnerability of the Service without our written
            permission;
          </li>
          <li>
            resell, sublicense, or white-label the Service without our written agreement;
          </li>
          <li>
            upload malicious code or content that infringes another person&apos;s rights;
          </li>
          <li>use the Service to send unsolicited bulk messages.</li>
        </ul>
        <p>We may suspend or terminate accounts that breach this section.</p>
      </LegalSection>

      <LegalSection number={6} title="Invoices, payments, and financial records">
        <ol>
          <li>
            Modufy helps you create and track invoices, record payments (including cash,
            card, bank transfer, and mobile money), and maintain accounting records.{" "}
            <strong>
              Modufy is a record-keeping tool, not a bank, payment processor, or licensed
              financial institution.
            </strong>
          </li>
          <li>
            You remain solely responsible for your tax obligations, including VAT
            registration, filing, and remittance to the Ghana Revenue Authority or any other
            tax authority.
          </li>
          <li>
            Figures produced by the Service (totals, balances, VAT calculations, reports)
            depend on the data you enter. Verify important figures before relying on them.
            Modufy does not provide accounting, tax, or legal advice.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={7} title="Paid modules and subscriptions">
        <ol>
          <li>
            Some features are offered as paid modules or subscription plans. Prices are
            shown in the app and may change with at least 30 days&apos; notice.
          </li>
          <li>
            Fees are billed in advance and are non-refundable except where the law requires
            otherwise or we say so in writing.
          </li>
          <li>
            If your subscription lapses, we may downgrade your workspace to a free tier or
            restrict access to paid modules. Your data remains exportable for a reasonable
            period.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={8} title="Marketplace and storefronts">
        <p>
          If you use Modufy to operate an online storefront, run promotions, or issue
          coupons, you are the seller of record. You are responsible for your product
          listings, pricing, order fulfilment, refunds, and compliance with consumer
          protection law. Modufy provides the software only and is not a party to
          transactions between you and your customers.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Intellectual property">
        <p>
          The Service, including its software, design, and branding, is owned by us or our
          licensors. We grant you a limited, non-exclusive, non-transferable licence to use
          the Service for your business while these Terms are in effect. You may not copy,
          modify, or reverse engineer the Service except as permitted by law.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Availability and changes">
        <p>
          We aim to keep the Service available at all times but do not guarantee
          uninterrupted operation. We may modify, add, or remove features. If we make a
          change that materially reduces core functionality you have paid for, we will tell
          you in advance where reasonably possible.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Termination">
        <ol>
          <li>
            You may close your account at any time from the app or by contacting us.
          </li>
          <li>
            We may suspend or terminate your access if you materially breach these Terms, if
            required by law, or if your use poses a security risk. Where practical, we will
            give you notice and a chance to export your data.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={12} title="Disclaimers">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the
          fullest extent permitted by law, we disclaim all warranties, express or implied,
          including fitness for a particular purpose and non-infringement. We do not warrant
          that reports or calculations are error-free.
        </p>
      </LegalSection>

      <LegalSection number={13} title="Limitation of liability">
        <p>To the fullest extent permitted by law:</p>
        <ol>
          <li>
            We are not liable for indirect, incidental, special, or consequential losses,
            including lost profits, lost revenue, or loss of data.
          </li>
          <li>
            Our total liability for any claim arising out of the Service is limited to the
            fees you paid us in the 12 months before the event giving rise to the claim.
          </li>
        </ol>
        <p>
          Nothing in these Terms excludes liability that cannot be excluded under applicable
          law.
        </p>
      </LegalSection>

      <LegalSection number={14} title="Indemnity">
        <p>
          You will indemnify us against claims, losses, and costs arising from your breach
          of these Terms, your data, or your use of the Service in violation of law or
          third-party rights.
        </p>
      </LegalSection>

      <LegalSection number={15} title="Governing law and disputes">
        <p>
          These Terms are governed by the laws of the Republic of Ghana. Disputes will be
          resolved in the courts of Ghana, after a good-faith attempt to settle the matter
          amicably.
        </p>
      </LegalSection>

      <LegalSection number={16} title="Changes to these Terms">
        <p>
          We may update these Terms from time to time. We will notify you of material
          changes by email or in the app at least 14 days before they take effect. Continued
          use of the Service after the effective date means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection number={17} title="Contact">
        <p>
          Modufy
          <br />
          Accra, Ghana
          <br />
          Email: legal@modufy.app
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
