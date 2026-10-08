const pages = [
  ["Features", "features.html"],
  ["How It Works", "how-it-works.html"],
  ["Security", "security.html"],
  ["Pricing", "pricing.html"],
  ["FAQ", "faq.html"]
];

const footerPages = [
  ["Features", "features.html"],
  ["How It Works", "how-it-works.html"],
  ["Security", "security.html"],
  ["Pricing", "pricing.html"],
  ["FAQ", "faq.html"],
  ["Request a Demo", "demo.html"],
  ["About MI TECH", "about.html"],
  ["Contact", "contact.html"],
  ["Privacy Policy", "privacy.html"],
  ["Terms of Service", "terms.html"],
  ["Cookie Policy", "cookies.html"]
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const activeLink = (label, href) => {
  const current = currentPage === href ? ' aria-current="page"' : "";
  return `<a href="${href}"${current}>${label}</a>`;
};

document.querySelector("[data-site-header]").innerHTML = `
  <div class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="index.html" aria-label="MI TECH, Business Management System home">
        <span class="brand-mark" aria-hidden="true"><span>MI</span><i></i></span>
        <span class="brand-copy"><strong>MI TECH</strong><span>BUSINESS MANAGEMENT SYSTEM</span></span>
      </a>
      <nav class="nav-links" id="primary-navigation" aria-label="Main navigation">
        ${pages.map(([label, href]) => activeLink(label, href)).join("")}
        <a class="mobile-nav-cta" href="demo.html">Talk through your workflow <span aria-hidden="true">↗</span></a>
      </nav>
      <a class="button button-primary nav-cta" href="demo.html">Request a Demo <span aria-hidden="true">↗</span></a>
      <button class="nav-toggle" type="button" aria-label="Open navigation menu" aria-controls="primary-navigation" aria-expanded="false"><span class="menu-glyph" aria-hidden="true"><i></i><i></i></span><span class="menu-label">Menu</span></button>
    </div>
  </div>
`;

document.querySelector("[data-site-footer]").innerHTML = `
  <div class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <a class="brand" href="index.html">
            <span class="brand-mark" aria-hidden="true"><span>MI</span><i></i></span>
            <span class="brand-copy"><strong>MI TECH</strong><span>BUSINESS MANAGEMENT SYSTEM</span></span>
          </a>
          <p class="footer-promise">Manage Your Business. Know Your Numbers. Grow With Confidence.</p>
          <p>For the people who buy, weigh and keep produce moving.</p>
          <p>Business management for agricultural and raw-product businesses.</p>
          <a class="footer-demo-link" href="demo.html">Let's talk about your operation <span aria-hidden="true">↗</span></a>
        </div>
        <div class="footer-col">
          <h2><span>01</span> Explore</h2>
          <nav class="footer-links" aria-label="Footer navigation">
            ${footerPages.map(([label, href]) => activeLink(label, href)).join("")}
          </nav>
        </div>
        <div class="footer-col footer-contact">
          <h2><span>02</span> Get in touch</h2>
          <div class="contact-icon-links" aria-label="Direct contact options">
            <a href="https://wa.me/233594528561" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp MI TECH at 0594528561" title="WhatsApp: 0594528561">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.49 15l-1.3 4.73 4.85-1.27A9.95 9.95 0 1 0 12.04 2Zm0 18.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-2.88.76.77-2.8-.2-.31A8.1 8.1 0 1 1 12.04 20.1Zm4.45-6.07c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.68 2.56 4.07 3.59.57.25 1.02.4 1.37.5.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>
            </a>
            <a href="mailto:amwahid005@gmail.com" aria-label="Email MI TECH at amwahid005@gmail.com" title="Email: amwahid005@gmail.com">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/><path fill="currentColor" d="m4 6 8 5 8-5" opacity=".45"/></svg>
            </a>
            <a href="tel:+233530466346" aria-label="Call MI TECH at 0530466346" title="Phone: 0530466346">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.56 3.57.56.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.56 3.57a1 1 0 0 1-.25 1.02l-2.19 2.2Z"/></svg>
            </a>
          </div>
          <div class="social-links" aria-label="Social profiles">
            <a href="https://github.com/am-wahid05" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="https://github.com/am-wahid05">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.31-3.75-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .7 1.86.5 2.31.38.1-.73.4-1.22.72-1.5-2.47-.28-5.07-1.23-5.07-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.4.11-2.92 0 0 .93-.3 3.05 1.14A10.7 10.7 0 0 1 12 5.7c.94 0 1.89.13 2.77.37 2.12-1.44 3.04-1.14 3.04-1.14.61 1.52.23 2.64.12 2.92.71.77 1.14 1.76 1.14 2.97 0 4.27-2.61 5.2-5.1 5.48.4.35.76 1.02.76 2.06v3.63c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
            </a>
            <a href="https://x.com/am_wahid05" target="_blank" rel="noopener noreferrer" aria-label="X profile" title="https://x.com/am_wahid05">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.8 5.7 22H2.5l7.3-8.4L1.9 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/abdul-wahid-mumuni-617a3a342" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="https://www.linkedin.com/in/abdul-wahid-mumuni-617a3a342">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.53v16.94c0 .85.69 1.53 1.55 1.53h16.9c.86 0 1.55-.68 1.55-1.53V3.53c0-.85-.69-1.53-1.55-1.53ZM7.93 18.8H4.96V9.25h2.97v9.55ZM6.45 7.94a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.38 10.86h-2.96v-4.65c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.2-1.79 2.46v4.73H9.57V9.25h2.84v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 3 0 3.58 1.98 3.58 4.56v5.23Z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom"><p>© <span data-year></span> MI TECH. Business Management System.</p><p><a href="cookies.html">Cookie Policy</a></p></div>
    </div>
  </div>
`;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#primary-navigation");
navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  nav.classList.toggle("is-open", !isOpen);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }
});
document.querySelectorAll(".screen-frame img").forEach((image) => {
  const link = document.createElement("a");
  link.className = "screen-image-link";
  link.href = image.src;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Open full-size screenshot: ${image.alt}`);
  image.before(link);
  link.append(image);
  const caption = image.closest("figure")?.querySelector("figcaption");
  if (caption) {
    const hint = document.createElement("span");
    hint.className = "screen-open-hint";
    hint.textContent = "Open full-size image";
    caption.append(hint);
  }
});
const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-figure, .intro-band h2, .section-heading, .role-card, .split-feature > *, .cloud-panel, .value-item, .price-card, .faq-list details, .page-hero-inner, .feature-category, .step-item, .security-card, .pricing-notes article, .demo-aside, .demo-form, .contact-card"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  revealTargets.forEach((element) => {
    element.classList.add("reveal-item");
    revealObserver.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navToggle.focus();
  }
});

const canonicalBaseUrl = window.SITE_CONFIG?.canonicalBaseUrl;
if (canonicalBaseUrl && canonicalBaseUrl !== "YOUR_DOMAIN_HERE") {
  try {
    const base = new URL(canonicalBaseUrl);
    if (base.protocol === "https:" && base.hostname) {
      const canonical = new URL(currentPage === "index.html" ? "./" : currentPage, base);
      const canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonical.href;
      document.head.append(canonicalLink);
      const ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      ogUrl.content = canonical.href;
      document.head.append(ogUrl);
      const description = document.querySelector('meta[name="description"]')?.content ?? "";
      const socialImage = new URL("assets/screenshots/secretary-dashboard.png", base);
      const metadata = [
        ["property", "og:image", socialImage.href],
        ["name", "twitter:card", "summary_large_image"],
        ["name", "twitter:title", document.title],
        ["name", "twitter:description", description],
        ["name", "twitter:image", socialImage.href]
      ];
      for (const [attribute, key, content] of metadata) {
        const tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        tag.content = content;
        document.head.append(tag);
      }
    } else {
      console.error("Canonical URL must use HTTPS.");
    }
  } catch (error) {
    console.error("The configured canonical URL is invalid.", error);
  }
}

const demoForm = document.querySelector("[data-demo-form]");
if (demoForm) {
  const result = document.querySelector("[data-demo-result]");
  const resultTitle = result.querySelector("[data-demo-result-title]");
  const resultMessage = result.querySelector("[data-demo-result-message]");
  const resultContact = result.querySelector("[data-demo-contact]");
  const submitButton = demoForm.querySelector("button[type='submit']");
  const defaultButtonText = submitButton.textContent;
  let pendingSubmissionId = "";
  let pendingSubmissionSignature = "";

  const showDemoResult = (state, title, message, showContact = false) => {
    result.dataset.state = state;
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultContact.hidden = !showContact;
    result.hidden = false;
    result.focus();
  };

  const createSubmissionId = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  demoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!demoForm.reportValidity()) return;
    if (submitButton.disabled) return;

    const formData = new FormData(demoForm);
    const fields = {
      full_name: String(formData.get("fullName") ?? "").trim(),
      business_name: String(formData.get("businessName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      business_type: String(formData.get("businessType") ?? "").trim(),
      team_size: Number(formData.get("teamSize")),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim()
    };
    const signature = JSON.stringify(fields);
    if (!pendingSubmissionId || pendingSubmissionSignature !== signature) {
      pendingSubmissionId = createSubmissionId();
      pendingSubmissionSignature = signature;
    }

    const { supabaseUrl, supabasePublishableKey } = window.SITE_CONFIG ?? {};
    if (!supabaseUrl || !supabasePublishableKey ||
        supabaseUrl === "YOUR_SUPABASE_PROJECT_URL" ||
        supabasePublishableKey === "YOUR_SUPABASE_PUBLISHABLE_KEY") {
      showDemoResult(
        "error",
        "Demo requests aren't connected yet.",
        "MI TECH still needs to connect this form to its Supabase project. Your details have not been sent or saved.",
        true
      );
      return;
    }

    let endpoint;
    try {
      const projectUrl = new URL(supabaseUrl);
      if (projectUrl.protocol !== "https:" || projectUrl.username || projectUrl.password ||
          projectUrl.pathname !== "/" || projectUrl.search || projectUrl.hash) {
        throw new Error("Invalid Supabase project URL.");
      }
      endpoint = `${projectUrl.origin}/functions/v1/demo-request`;
    } catch {
      showDemoResult(
        "error",
        "Demo requests aren't connected yet.",
        "The Supabase project URL needs to be configured correctly. Your details have not been sent or saved.",
        true
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending request...";
    demoForm.setAttribute("aria-busy", "true");
    result.hidden = true;

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabasePublishableKey
        },
        body: JSON.stringify({ ...fields, submission_id: pendingSubmissionId })
      });
    } catch {
      showDemoResult(
        "error",
        "We couldn't reach the request service.",
        "Your form is still here. Check your connection and try again. If the problem continues, email MI TECH.",
        true
      );
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
      demoForm.removeAttribute("aria-busy");
      return;
    }

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok && data.saved === true && data.notified === true) {
      demoForm.reset();
      pendingSubmissionId = "";
      pendingSubmissionSignature = "";
      showDemoResult(
        "success",
        "Thanks — your request is with MI TECH.",
        "We've received your demo request and will use the contact details you provided to follow up."
      );
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
      demoForm.removeAttribute("aria-busy");
      return;
    }

    if (data.saved === true && data.notified === false) {
      showDemoResult(
        "error",
        "Your request was saved, but the email alert didn't go through.",
        "Your details are safely recorded. Please email MI TECH directly as well; you can retry this request without creating a duplicate.",
        true
      );
    } else if (response.status === 429) {
      showDemoResult(
        "error",
        "Please wait before trying again.",
        "We received several requests from this connection. Please try again in about 15 minutes, or contact MI TECH directly.",
        true
      );
    } else {
      showDemoResult(
        "error",
        "We couldn't submit your request.",
        "Your form is still here. Please try again in a moment, or email MI TECH directly if the problem continues.",
        true
      );
    }
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
    demoForm.removeAttribute("aria-busy");
  });
}
