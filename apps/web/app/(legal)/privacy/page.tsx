import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/features/legal/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy | BizOS",
  description: "How BizOS collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      lastUpdated="10 June 2026"
      intro={
        <p>
          This Privacy Policy explains how BizOS (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;) collects, uses, and protects personal information when you use
          the BizOS web application and related services (the &ldquo;Service&rdquo;). We are
          committed to handling personal data in line with the Data Protection Act, 2012
          (Act 843) of Ghana and other applicable law.
        </p>
      }
    >
      <LegalSection number={1} title="Two kinds of data">
        <p>It helps to distinguish two roles:</p>
        <ol>
          <li>
            <strong>Account data</strong>, where we decide how data is used (we act as data
            controller). This is information about you and your team as users of BizOS.
          </li>
          <li>
            <strong>Business data</strong>, which you enter about your own customers, sales,
            and finances. For this data, your business is the controller and we process it
            only on your instructions to provide the Service.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number={2} title="Information we collect">
        <p>
          <strong>Information you give us:</strong>
        </p>
        <ul>
          <li>
            Account details: name, email address, password (stored as a secure hash, never
            in plain text), phone number, and business details such as business name,
            sector, and location.
          </li>
          <li>
            Business data: customer names and contact details, invoices, sales, expenses,
            payment records (including mobile money references), inventory, and accounting
            entries you enter into your workspace.
          </li>
          <li>Communications: messages you send to our support channels.</li>
        </ul>
        <p>
          <strong>Information collected automatically:</strong>
        </p>
        <ul>
          <li>Usage data: pages visited, features used, and actions taken in the app.</li>
          <li>
            Device and log data: IP address, browser type, operating system, and timestamps,
            used for security and troubleshooting.
          </li>
          <li>
            Cookies and similar technologies: used to keep you signed in, remember
            preferences (such as theme), and understand how the Service is used. Essential
            cookies cannot be disabled; you can control others through your browser.
          </li>
        </ul>
        <p>
          <strong>What we do not collect:</strong> we do not ask for or store your mobile
          money PIN, full card numbers, or bank credentials. Payment records in BizOS are
          references you enter, not payment instructions we execute.
        </p>
      </LegalSection>

      <LegalSection number={3} title="How we use information">
        <p>We use personal data to:</p>
        <ul>
          <li>
            provide, operate, and secure the Service, including authentication and
            two-factor authentication;
          </li>
          <li>
            maintain separation between business workspaces so each business can only see
            its own data;
          </li>
          <li>process subscription billing;</li>
          <li>respond to support requests;</li>
          <li>
            send service notices such as security alerts, billing notices, and material
            changes to terms;
          </li>
          <li>
            send product updates and marketing, which you can opt out of at any time;
          </li>
          <li>
            monitor, debug, and improve the Service, using aggregated or anonymised data
            where possible;
          </li>
          <li>comply with legal obligations.</li>
        </ul>
        <p>
          We do not sell personal data. We do not use your business data to train AI models
          or for advertising.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Legal bases">
        <p>
          Where Act 843 or other law requires a lawful basis, we rely on: performance of our
          contract with you; your consent (for example, marketing emails); our legitimate
          interests in securing and improving the Service; and compliance with legal
          obligations.
        </p>
      </LegalSection>

      <LegalSection number={5} title="How we share information">
        <p>We share personal data only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who host infrastructure, store files, send
            emails, or process payments on our behalf, under contracts that restrict their
            use of the data;
          </li>
          <li>
            <strong>Your workspace</strong>: information you enter is visible to other
            members of your business workspace according to the permissions your workspace
            owner sets;
          </li>
          <li>
            <strong>Authorities</strong>, where required by law, court order, or to protect
            rights, safety, or the integrity of the Service;
          </li>
          <li>
            <strong>A successor entity</strong>, if we are involved in a merger,
            acquisition, or asset sale, in which case we will notify you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={6} title="International transfers">
        <p>
          Some of our service providers may store or process data outside Ghana. Where that
          happens, we take steps to ensure the data receives an adequate level of protection
          consistent with Act 843.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Security">
        <p>
          We protect data using measures including encryption in transit (TLS), hashed
          passwords, role-based access control, workspace isolation, and least-privilege
          access for our staff. No system is completely secure; if we become aware of a
          breach affecting your personal data, we will notify you and the relevant
          authorities as required by law.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Retention">
        <ul>
          <li>
            Account data is kept while your account is active and for a reasonable period
            afterwards to handle disputes and legal obligations.
          </li>
          <li>
            Business data is kept while your workspace is active. After account closure, we
            delete or anonymise it within 90 days, except where law (such as tax law)
            requires longer retention.
          </li>
          <li>Backups are retained on a rolling schedule and purged automatically.</li>
        </ul>
      </LegalSection>

      <LegalSection number={9} title="Your rights">
        <p>Under Act 843 you have the right to:</p>
        <ul>
          <li>access the personal data we hold about you;</li>
          <li>ask us to correct inaccurate data;</li>
          <li>ask us to delete data, subject to legal retention requirements;</li>
          <li>object to or restrict certain processing;</li>
          <li>withdraw consent where processing is based on consent;</li>
          <li>
            complain to the Data Protection Commission of Ghana if you believe your rights
            have been infringed.
          </li>
        </ul>
        <p>
          To exercise these rights, contact us at the address below. If your personal data
          was entered into BizOS by a business you deal with (for example, a shop that keeps
          your details as their customer), please contact that business first; we will
          support them in responding.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Children">
        <p>
          The Service is intended for business use by adults. We do not knowingly collect
          personal data from children under 18 as account holders.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Changes to this policy">
        <p>
          We may update this policy from time to time. We will notify you of material
          changes by email or in the app before they take effect. The &ldquo;Last
          updated&rdquo; date at the top shows the current version.
        </p>
      </LegalSection>

      <LegalSection number={12} title="Contact">
        <p>
          Data protection enquiries:
          <br />
          BizOS, Accra, Ghana
          <br />
          Email: privacy@bizos.app
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
