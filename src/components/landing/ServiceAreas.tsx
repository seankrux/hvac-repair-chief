import { MapPin, Phone } from 'lucide-react';

const serviceAreas = [
  { city: 'Pompano Beach', county: 'Broward County' },
  { city: 'Deerfield Beach', county: 'Broward County' },
  { city: 'Coral Springs', county: 'Palm Beach County' },
  { city: 'Margate', county: 'Palm Beach County' },
  { city: 'Lighthouse Point', county: 'Miami-Dade County' },
  { city: 'Parkland', county: 'Miami-Dade County' },
  { city: 'Weston', county: 'Broward County' },
  { city: 'Davie', county: 'Palm Beach County' },
  { city: 'Plantation', county: 'Miami-Dade County' },
  { city: 'Tamarac', county: 'Broward County' },
  { city: 'Sunrise', county: 'Palm Beach County' },
  { city: 'Wilton Manors', county: 'Miami-Dade County' },
];

const counties = [
  {
    name: 'Broward County',
    cities: ['Pompano Beach', 'Deerfield Beach', 'Weston', 'Tamarac']
  },
  {
    name: 'Palm Beach County',
    cities: ['Coral Springs', 'Margate', 'Davie', 'Sunrise']
  },
  {
    name: 'Miami-Dade County',
    cities: ['Lighthouse Point', 'Parkland', 'Plantation', 'Wilton Manors']
  }
];

export function ServiceAreas() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-600/10 border border-cyan-600/30 text-cyan-600 px-4 py-2 rounded-full mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-semibold">Serving Your Local Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Areas We Serve
          </h2>
          <p className="text-xl text-slate-600">
            Proud to serve homeowners throughout the region with expert HVAC services.
          </p>
        </div>

        {/* Counties Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {counties.map((county, index) => (
            <div
              key={index}
              className="bg-slate-100/80 border border-slate-700/50 rounded-xl p-8 hover:border-cyan-600/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-cyan-600" />
                {county.name}
              </h3>
              <ul className="space-y-2">
                {county.cities.map((city, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Coverage Map Placeholder */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-slate-100/80 border-2 border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                <p className="text-xl text-slate-600 font-semibold">Service Area Map</p>
                <p className="text-slate-500 mt-2">Covering a 50-mile radius</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cities List */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Cities & Communities We Serve
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-slate-100/80 border border-slate-600/30 rounded-lg px-4 py-3 text-center hover:border-cyan-600/30 hover:bg-slate-100/80 transition-all"
              >
                <div className="text-slate-900 font-semibold">{area.city}</div>
                <div className="text-xs text-slate-500 mt-1">{area.county}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Listed CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-600/10 to-teal-500/10 border-2 border-cyan-600/30 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Don&apos;t See Your City Listed?
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              We may still serve your area! Give us a call to check if we can help with your HVAC project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+19542896718"
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Phone className="h-5 w-5" />
                Call (954) 289-6718
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 border-2 border-slate-600 hover:border-slate-500"
              >
                Contact Us Online
              </a>
            </div>
          </div>
        </div>

        {/* Service Radius Info */}
        <div className="text-center mt-12">
          <p className="text-slate-500">
            We proudly serve a 50-mile radius with same-day emergency service available for most areas.
          </p>
        </div>
      </div>
    </section>
  );
}
