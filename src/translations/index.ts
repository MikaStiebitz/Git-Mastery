import commonEn from "./en/common";
import levelsEn from "./en/levels";
import terminalEn from "./en/terminal";
import homeEn from "./en/home";
import playgroundEn from "./en/playground";
import installationEn from "./en/installation";
import faqEn from "./en/faq";

import commonDe from "./de/common";
import levelsDe from "./de/levels";
import terminalDe from "./de/terminal";
import homeDe from "./de/home";
import playgroundDe from "./de/playground";
import installationDe from "./de/installation";
import faqDe from "./de/faq";

import commonFa from "./fa/common";
import levelsFa from "./fa/levels";
import terminalFa from "./fa/terminal";
import homeFa from "./fa/home";
import playgroundFa from "./fa/playground";
import installationFa from "./fa/installation";
import faqFa from "./fa/faq";

export const translations = {
    en: {
        ...commonEn,
        ...levelsEn,
        ...terminalEn,
        ...homeEn,
        ...playgroundEn,
        ...installationEn,
        ...faqEn,
    },
    de: {
        ...commonDe,
        ...levelsDe,
        ...terminalDe,
        ...homeDe,
        ...playgroundDe,
        ...installationDe,
        ...faqDe,
    },
    fa: {
        ...commonFa,
        ...levelsFa,
        ...terminalFa,
        ...homeFa,
        ...playgroundFa,
        ...installationFa,
        ...faqFa,
    },
};
