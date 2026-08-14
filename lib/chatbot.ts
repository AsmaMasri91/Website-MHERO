import { VehicleModel, Offer } from "@/lib/types";
import { Locale } from "@/lib/i18n";
import { formatCurrency } from "@/lib/financeMath";

export interface FaqItem {
  q: string;
  a: string;
}

export interface BotContext {
  locale: Locale;
  models: VehicleModel[];
  offers: Offer[];
  faqs: FaqItem[];
}

export interface BotReply {
  text: string;
  quickReplies: string[];
}

const DEFAULT_QUICK_REPLIES_EN = [
  "MHERO I pricing",
  "Current offers",
  "Book a test drive",
  "Compare models",
];
const DEFAULT_QUICK_REPLIES_AR = [
  "أسعار MHERO I",
  "العروض الحالية",
  "احجز تجربة قيادة",
  "قارن الموديلات",
];

function findSpecValue(model: VehicleModel, labelPattern: RegExp): string | undefined {
  for (const group of model.specs) {
    for (const item of group.items) {
      if (labelPattern.test(item.label)) return item.value;
    }
  }
  return undefined;
}

function findModel(models: VehicleModel[], t: string): VehicleModel | undefined {
  if (/terrain/.test(t)) return models.find((m) => m.slug === "mhero-2-terrain");
  if (/prime/.test(t)) return models.find((m) => m.slug === "mhero-2");
  if (/mhero\s*(ii|2)\b/.test(t)) return models.find((m) => m.slug === "mhero-2");
  if (/mhero\s*(i|1)\b/.test(t)) return models.find((m) => m.slug === "mhero-1");
  return undefined;
}

function scoreFaqMatch(question: string, t: string): number {
  const words = t.split(/\s+/).filter((w) => w.length > 3);
  const qLower = question.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (qLower.includes(w)) score += 1;
  }
  return score;
}

function modelSummary(model: VehicleModel, locale: Locale): string {
  const power = findSpecValue(model, /power/i);
  const range = findSpecValue(model, /range/i);
  const price = formatCurrency(model.startingPrice, model.currency);
  if (locale === "ar") {
    return `${model.name} — ${model.tagline}. يبدأ السعر من ${price}${power ? `، بقوة ${power}` : ""}${range ? `، ومدى يصل إلى ${range}` : ""}.`;
  }
  return `${model.name} — ${model.tagline}. Starting from ${price}${power ? `, ${power}` : ""}${range ? `, up to ${range} range` : ""}.`;
}

export function getBotReply(rawText: string, ctx: BotContext): BotReply {
  const { locale, models, offers, faqs } = ctx;
  const t = rawText.trim().toLowerCase();
  const isAr = locale === "ar";
  const defaultQuick = isAr ? DEFAULT_QUICK_REPLIES_AR : DEFAULT_QUICK_REPLIES_EN;

  if (!t) {
    return {
      text: isAr ? "هل يمكنك كتابة سؤالك؟" : "Could you type your question?",
      quickReplies: defaultQuick,
    };
  }

  // Greeting
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t) || /(مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير)/.test(rawText)) {
    return {
      text: isAr
        ? "أهلاً بك! يمكنني مساعدتك بمعلومات عن موديلات MHERO، الأسعار، العروض الحالية، أو حجز تجربة قيادة. عن أي شيء تود أن تسأل؟"
        : "Hey there! I can help with MHERO model info, pricing, current offers, or booking a test drive. What would you like to know?",
      quickReplies: defaultQuick,
    };
  }

  // Thanks
  if (/^(thanks|thank you|thx|cheers)\b/.test(t) || /(شكرا|شكرًا)/.test(rawText)) {
    return {
      text: isAr ? "على الرحب والسعة! هل هناك شيء آخر يمكنني مساعدتك به؟" : "You're welcome! Anything else I can help with?",
      quickReplies: defaultQuick,
    };
  }

  const mentionedModel = findModel(models, t);

  // Price / cost
  if (/\b(price|cost|how much|starting from)\b/.test(t) || /(سعر|كم يبلغ|كم سعر|تكلفة)/.test(rawText)) {
    if (mentionedModel) {
      return {
        text: modelSummary(mentionedModel, locale),
        quickReplies: isAr
          ? ["احسب التمويل", "قارن الموديلات", "احجز تجربة قيادة"]
          : ["Calculate finance", "Compare models", "Book a test drive"],
      };
    }
    const lines = models
      .map((m) => `• ${m.name}: ${formatCurrency(m.startingPrice, m.currency)}`)
      .join("\n");
    return {
      text: isAr
        ? `إليك أسعار الفئة الكاملة:\n${lines}`
        : `Here's pricing across the range:\n${lines}`,
      quickReplies: defaultQuick,
    };
  }

  // Specs: power / speed / range / battery / torque
  if (/\b(power|horsepower|hp|torque|top speed|0-100|acceleration)\b/.test(t) || /(قوة|حصان|عزم|سرعة)/.test(rawText)) {
    const model = mentionedModel ?? models[0];
    const power = findSpecValue(model, /power/i);
    const speed = findSpecValue(model, /top speed/i);
    const accel = findSpecValue(model, /0.?100/i);
    const torque = findSpecValue(model, /torque/i);
    return {
      text: isAr
        ? `${model.name}: القوة ${power ?? "-"}، السرعة القصوى ${speed ?? "-"}، التسارع 0-100 كم/س في ${accel ?? "-"}، عزم الدوران ${torque ?? "-"}.`
        : `${model.name}: ${power ?? "-"} power, ${speed ?? "-"} top speed, 0–100 km/h in ${accel ?? "-"}, ${torque ?? "-"} torque.`,
      quickReplies: isAr ? ["مدى البطارية", "أسعار الموديل", "قارن الموديلات"] : ["Battery range", "Model pricing", "Compare models"],
    };
  }

  // Range / battery / charging
  if (/\b(range|battery|charging|charge|km)\b/.test(t) || /(مدى|بطارية|شحن)/.test(rawText)) {
    const model = mentionedModel ?? models[0];
    const range = findSpecValue(model, /range/i);
    const battery = findSpecValue(model, /battery/i);
    const fastCharge = findSpecValue(model, /fast charging/i);
    return {
      text: isAr
        ? `${model.name}: مدى يصل إلى ${range ?? "-"}، سعة بطارية ${battery ?? "-"}${fastCharge ? `، شحن سريع ${fastCharge}` : ""}.`
        : `${model.name}: up to ${range ?? "-"} range, ${battery ?? "-"} battery${fastCharge ? `, fast charging ${fastCharge}` : ""}.`,
      quickReplies: defaultQuick,
    };
  }

  // Colours
  if (/\b(colou?r|colours?|paint)\b/.test(t) || /(لون|ألوان)/.test(rawText)) {
    const model = mentionedModel ?? models[0];
    const names = model.colours.map((c) => c.name).join(", ");
    return {
      text: isAr
        ? `الألوان المتاحة لـ ${model.name}: ${names}.`
        : `${model.name} is available in: ${names}.`,
      quickReplies: isAr ? ["اطلع على المواصفات", "احجز تجربة قيادة"] : ["See full specs", "Book a test drive"],
    };
  }

  // Test drive / booking
  if (/\b(test drive|book|appointment|schedule)\b/.test(t) || /(تجربة قيادة|احجز|موعد)/.test(rawText)) {
    return {
      text: isAr
        ? "يسعدنا حجز تجربة قيادة لك! توجه إلى صفحة \"احجز تجربة قيادة\" ضمن قائمة الموديلات، واختر السيارة والموعد المناسب — سيؤكد فريقنا خلال 24 ساعة."
        : "I'd be glad to help you book a test drive. Head to the \"Book a Test Drive\" page under the Models menu, pick your model and preferred time — our team will confirm within 24 hours.",
      quickReplies: isAr ? ["أين المعرض؟", "أسعار الموديلات"] : ["Where's the showroom?", "Model pricing"],
    };
  }

  // Finance
  if (/\b(finance|financing|loan|installment|monthly payment|0%|down ?payment)\b/.test(t) || /(تمويل|قسط|دفعة)/.test(rawText)) {
    const zeroPercentOffer = offers.find((o) => /0%/.test(o.title));
    return {
      text: isAr
        ? `يمكنك استخدام حاسبة التمويل لدينا لتقدير القسط الشهري.${zeroPercentOffer ? ` كما لدينا حاليًا عرض "${zeroPercentOffer.title}".` : ""}`
        : `You can use our Finance Calculator to estimate monthly payments.${zeroPercentOffer ? ` We also currently have a "${zeroPercentOffer.title}" offer running.` : ""}`,
      quickReplies: isAr ? ["افتح حاسبة التمويل", "العروض الحالية"] : ["Open finance calculator", "Current offers"],
    };
  }

  // Offers / promotions
  if (/\b(offer|promo|promotion|discount|deal)\b/.test(t) || /(عرض|عروض|خصم)/.test(rawText)) {
    if (offers.length === 0) {
      return {
        text: isAr ? "لا توجد عروض نشطة حاليًا، تابعنا لمعرفة الجديد." : "No active offers right now — check back soon.",
        quickReplies: defaultQuick,
      };
    }
    const lines = offers.map((o) => `• ${o.title}`).join("\n");
    return {
      text: isAr ? `العروض الحالية:\n${lines}` : `Here are our current offers:\n${lines}`,
      quickReplies: isAr ? ["احسب التمويل", "احجز تجربة قيادة"] : ["Calculate finance", "Book a test drive"],
    };
  }

  // Compare
  if (/\bcompare\b/.test(t) || /(قارن|مقارنة)/.test(rawText)) {
    return {
      text: isAr
        ? "يمكنك مقارنة موديلات MHERO جنبًا إلى جنب في صفحة \"قارن الموديلات\" ضمن قائمة الموديلات."
        : "You can compare MHERO models side by side on the \"Compare Models\" page under the Models menu.",
      quickReplies: defaultQuick,
    };
  }

  // FAQ keyword match (warranty, service, trade-in, etc. fall through to here)
  let bestFaq: FaqItem | null = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const score = scoreFaqMatch(faq.q, t);
    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }
  if (bestFaq && bestScore >= 2) {
    return { text: bestFaq.a, quickReplies: defaultQuick };
  }

  // Contact / location
  if (/\b(contact|phone|number|location|address|showroom|where)\b/.test(t) || /(تواصل|هاتف|عنوان|موقع|معرض)/.test(rawText)) {
    return {
      text: isAr
        ? "يمكنك التواصل معنا على 600540045 أو زيارة معرضنا على شارع الشيخ زايد، دبي. لمزيد من التفاصيل تفضل بزيارة صفحة اتصل بنا."
        : "You can reach us at 600 540045 or visit our showroom on Sheikh Zayed Road, Dubai. See the Contact Us page for full details.",
      quickReplies: defaultQuick,
    };
  }

  return {
    text: isAr
      ? "لست متأكدًا من إجابة دقيقة لذلك، لكن يمكنني مساعدتك بمعلومات عن الموديلات، الأسعار، العروض، أو حجز تجربة قيادة. أو تواصل مع فريقنا مباشرة عبر صفحة اتصل بنا."
      : "I don't have a precise answer for that, but I can help with model info, pricing, offers, or booking a test drive — or reach our team directly via the Contact Us page.",
    quickReplies: defaultQuick,
  };
}
