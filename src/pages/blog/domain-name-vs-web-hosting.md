---
layout: ../../layouts/BlogPost.astro
title: "Domain Name vs Web Hosting: What's the Difference?"
description: "Understand the difference between a domain name, web hosting, DNS, and a website, with examples and a simple setup checklist."
category: Website setup
pubDate: 2026-10-12
updatedDate: 2026-10-12
---

A domain name and web hosting solve different problems. You usually need both to launch a traditional website, although some modern publishing platforms include hosting within their plans.

**The domain name is the address. Web hosting is where the website is served from.**

If `example.com` is your domain, visitors use that address to find your site. Your host stores or serves the pages, application and assets behind it.

## What does a domain registrar do?

A registrar helps you register and manage a domain for a period of time. It typically gives you controls for nameservers, DNS records, renewal settings and transfers.

Registering a domain alone does not automatically create a working website. It also does not guarantee an email inbox.

## What does a hosting provider do?

A hosting or deployment provider makes a website reachable on the internet. It may provide storage, computing resources, a content management system or static hosting.

A site built with a static framework may be hosted differently from a WordPress installation or a database-backed application. The requirements depend on what your website actually needs.

## What is DNS, and why is it involved?

DNS connects a readable domain name to the services handling its web and email traffic.

Common DNS records include:

- **A or AAAA:** Point a hostname towards an IP address.
- **CNAME:** Point one hostname to another hostname, subject to provider rules.
- **MX:** Direct mail delivery towards email servers.
- **TXT:** Carry text-based configuration, including many email authentication values.

You should follow your hosting and email provider's exact setup instructions. Changing the wrong record can interrupt services.

## Do I have to buy hosting and domain registration together?

No. You can register a domain with one company and host your site with another. This can give you flexibility, but you need to manage DNS correctly.

Buying both from one provider may simplify setup for a beginner, but compare renewal costs, portability, and support before deciding.

## Can I own a domain without a website?

Yes. You can register a name for a future project and leave it unconnected to a public website. Remember that registration still needs renewing to keep control of it.

## How to set up a domain and website

1. Choose a clear domain name and [check its availability](/domain-availability-checker).
2. Register it through a registrar after reviewing the renewal cost.
3. Set up the website with your chosen hosting provider.
4. Follow the provider's guidance to configure DNS or nameservers.
5. Wait for updates to propagate, then test the domain with and without `www`, if both are intended.
6. Enable HTTPS and verify your website and email work as expected.

## Common mistakes to avoid

- Thinking that paying for a domain means hosting is included.
- Turning off a domain's auto-renewal without planning the expiry date.
- Losing access to the account that manages the domain.
- Copying DNS records from a tutorial without matching your provider.
- Expecting a new DNS change to become visible everywhere immediately.

**Next:** Read [what is a domain name?](/blog/what-is-a-domain-name) or [how to choose a domain name](/blog/how-to-choose-a-domain-name) to complete the basics.
