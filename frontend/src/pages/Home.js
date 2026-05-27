import {
  Users,
  MessageCircle,
  Star,
  Calendar,
} from "lucide-react";

function Home() {
  const skills = [
    "Guitar Lessons",
    "Web Development",
    "Watercolor Painting",
    "Yoga & Meditation",
    "Photography",
    "Spanish Language",
  ];

  return (
    <div className="bg-gradient-to-b from-white via-purple-50 to-pink-50 text-gray-900 min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">SkillExchange</h1>

        <div className="flex gap-4">
          <a
            href="/login"
            className="border border-gray-700 px-5 py-2 rounded-xl"
          >
            Login
          </a>

          <a
            href="/register"
            className="bg-purple-600 text-white hover:bg-purple-700  px-5 py-2 rounded-xl font-semibold"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <p className="text-purple-400 mb-4">
          Peer-to-Peer Learning Platform
        </p>

        <h1 className="text-6xl font-bold max-w-4xl mx-auto leading-tight">
          Share What You Know.
          <br />
          Learn What You Love.
        </h1>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
          A peer-to-peer learning platform where skills are exchanged,
          not just taught.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <a
            href="/register"
            className="bg-purple-600 px-6 py-3 rounded-xl font-semibold"
          >
            Get Started →
          </a>

          <a
            href="/dashboard"
            className="border border-gray-700 px-6 py-3 rounded-xl"
          >
            Explore Skills
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Create Profile",
              desc: "List skills you can teach and want to learn.",
            },
            {
              title: "Find or Offer",
              desc: "Browse the marketplace or offer expertise.",
            },
            {
              title: "Book & Learn",
              desc: "Schedule sessions and grow together.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-xl p-8 rounded-2xl border border-gray-800"
            >
              <div className="text-purple-400 text-3xl font-bold mb-4">
                0{i + 1}
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="px-8 py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-4xl font-bold text-center mb-16">
          Featured Skills
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="bg-white shadow-xl p-6 rounded-2xl border border-gray-800 hover:border-purple-500 transition"
            >
              <h3 className="text-2xl font-semibold">{skill}</h3>

              <div className="flex items-center mt-4 text-yellow-400">
                <Star size={18} />
                <span className="ml-2">4.8</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Skill Exchange?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users />,
              title: "Community Driven",
            },
            {
              icon: <MessageCircle />,
              title: "Safe Messaging",
            },
            {
              icon: <Calendar />,
              title: "Flexible Scheduling",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-xl p-8 rounded-2xl border border-gray-800"
            >
              <div className="text-purple-400 mb-4">
                {item.icon}
              </div>

              <h3 className="text-2xl font-semibold">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-center text-gray-500">
        © 2026 SkillExchange. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
