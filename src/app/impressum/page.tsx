"use client";

import { PageLayout } from "~/components/layout/PageLayout";
import { Card } from "~/components/ui/card";
import { useLanguage } from "~/contexts/LanguageContext";

export default function ImpressumPage() {
    const { language } = useLanguage();

    return (
        <PageLayout>
            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
                <h1 className="font-display text-gm-ink text-3xl leading-[1.05] [text-wrap:balance] [overflow-wrap:anywhere] sm:text-4xl sm:[overflow-wrap:normal]">
                    Impressum
                </h1>

                {/* The legally required contact details: the one discrete object on the page. */}
                <Card className="mt-8 p-5 sm:p-7">
                    <h2 className="text-gm-ink text-lg font-bold sm:text-xl">
                        {language === "de" ? "Angaben gemäß § 5 TMG" : "Information according to § 5 TMG"}
                    </h2>
                    <div className="text-gm-ink-soft mt-4 space-y-4 leading-relaxed">
                        <p>
                            <strong className="text-gm-ink font-semibold">
                                {language === "de" ? "Verantwortlich für den Inhalt:" : "Responsible for content:"}
                            </strong>
                            <br />
                            Mika Stiebitz
                            <br />
                            Rabenhofstraße 25
                            <br />
                            91522 Ansbach
                            <br />
                            {language === "de" ? "Deutschland" : "Germany"}
                        </p>

                        <p>
                            <strong className="text-gm-ink font-semibold">
                                {language === "de" ? "Kontakt:" : "Contact:"}
                            </strong>
                            <br />
                            E-Mail: mika.stiebitz@gmail.com
                            <br />
                        </p>
                    </div>
                </Card>

                {/* Legal prose: plain text on the page surface, capped to a readable measure. */}
                <div className="text-gm-ink-soft mt-12 max-w-[68ch] space-y-5 leading-relaxed">
                    {language === "de" ? (
                        <>
                            <h2 className="text-gm-ink text-xl font-bold sm:text-2xl">Haftungsausschluss</h2>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Haftung für Inhalte</h3>
                            <p>
                                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                                Tätigkeit hinweisen.
                            </p>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Haftung für Links</h3>
                            <p>
                                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
                                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
                                übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
                                Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
                                Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
                                Zeitpunkt der Verlinkung nicht erkennbar.
                            </p>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Urheberrecht</h3>
                            <p>
                                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                                Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
                                nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-gm-ink text-xl font-bold sm:text-2xl">Disclaimer</h2>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Liability for Content</h3>
                            <p>
                                The contents of our pages were created with the utmost care. However, we cannot
                                guarantee the accuracy, completeness, and timeliness of the content. As a service
                                provider, we are responsible for our own content on these pages in accordance with § 7
                                Sec. 1 of the German Telemedia Act (TMG). According to §§ 8 to 10 TMG, however, we as a
                                service provider are not obligated to monitor transmitted or stored third-party
                                information or to investigate circumstances that indicate illegal activity.
                            </p>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Liability for Links</h3>
                            <p>
                                Our website contains links to external third-party websites over whose content we have
                                no influence. Therefore, we cannot accept any liability for this third-party content.
                                The respective provider or operator of the linked pages is always responsible for their
                                content. The linked pages were checked for possible legal violations at the time of
                                linking. Illegal content was not apparent at the time of linking.
                            </p>

                            <h3 className="text-gm-ink pt-3 text-lg font-bold">Copyright</h3>
                            <p>
                                The content and works created by the site operators on these pages are subject to German
                                copyright law. Duplication, processing, distribution, and any form of commercialization
                                of such material beyond the scope of the copyright law require the written consent of
                                its respective author or creator. Downloads and copies of this site are only permitted
                                for private, non-commercial use.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
