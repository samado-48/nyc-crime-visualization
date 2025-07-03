const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              NYC Crime Visualization Platform
            </h1>
            <p className="text-lg lg:text-xl text-primary-100 max-w-3xl mx-auto">
              Explore crime data across New York City with interactive maps and advanced filtering capabilities
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 