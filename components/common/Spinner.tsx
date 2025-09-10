const Spinner = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
      </div>
    </div>
  );
};

export default Spinner;
