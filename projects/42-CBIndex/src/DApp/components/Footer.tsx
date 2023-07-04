// import DarkModeToggle from './DarkModeToggle'

const Footer = () => {
  return (
    <footer className="flex flex-col justify-start p-4 border-t w-fu-ll bg-zinc-950">
      {/* <DarkModeToggle /> */}
      <div className="text-gray-900">
        CBIndex DApp Demo | Version 1.0.6 © 2023 CypherBabel Labs. All Rights
        Reserved.
      </div>
      <div className="mt-8 text-sm font-bold text-gray-700">
        Important Disclaimer
      </div>
      <div className="text-sm text-gray-700 ">
        The information, data, and services provided on the CBIndex platform are
        for informational purposes only and should not be considered as
        financial, investment, legal, or tax advice. CBIndex does not guarantee
        the accuracy, completeness, or timeliness of the information provided on
        the platform. CBIndex is not responsible for any actions taken or
        decisions made based on the information, data,or services provided.
        Crypto index data, index creation and management, index fund creation
        and management, and index fund investing capabilities offered by CBIndex
        involve a high degree of risk, and the value of investments may
        fluctuate and can go down as well as up. You may lose some or all of
        your invested capital. Past performance is not indicative of future
        results, and no representation or warranty is made that any investment
        strategy or performance will be consistent with past performance.
        CBIndex does not provide personalized investment advice or
        recommendations. Before making any investment or financial decision,
        users should consult with a qualified financial advisor, legal counsel,
        or tax professional to discuss their specific situation, objectives, and
        risk tolerance. Users should also carefully consider their investment
        objectives, risks, charges, and expenses before investing in any crypto
        index fund or other investment products offered on the CBIndex platform.
        By using the CBIndex platform, you agree to be bound by the terms and
        conditions of the platform and acknowledge that investing in
        cryptocurrencies and related products involves significant risks.
        CBIndex, its affiliates, and its employees are not liable for any
        direct, indirect, incidental, consequential, or any other damages
        arising from the use of the platform, its services, or any information
        provided on the platform. CBIndex reserves the right to modify, suspend,
        or discontinue any services or features available on the platform at any
        time without notice. CBIndex is not responsible for any errors or
        omissions, or for the results obtained from the use of the platform's
        services or information.
      </div>
    </footer>
  )
}

export default Footer
