const ADAInfoPage = () => {
  return (
    <div className="max-w-7/8 mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Understanding ADA Compliance for Web Accessibility
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          What is ADA Compliance?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Americans with Disabilities Act (ADA) requires that all electronic and information technology
          be accessible to people with disabilities. This includes websites and web applications.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Web Content Accessibility Guidelines (WCAG)
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          WCAG provides a set of guidelines for making web content more accessible. The guidelines are organized
          around four principles: Perceivable, Operable, Understandable, and Robust (POUR).
        </p>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">Perceivable</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Information and user interface components must be presentable to users in ways they can perceive.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">Operable</h3>
          <p className="text-gray-700 dark:text-gray-300">
            User interface components and navigation must be operable by all users.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">Understandable</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Information and the operation of user interface must be understandable.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">Robust</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Content must be robust enough that it can be interpreted reliably by a wide variety of user agents.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">
          Additional Resources
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">
            WCAG Official Documentation
          </a>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <a href="https://www.ada.gov/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">
            ADA Official Website
          </a>
        </p>
      </div>
    </div>
  );
};

export default ADAInfoPage;
