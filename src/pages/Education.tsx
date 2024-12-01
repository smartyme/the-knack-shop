import React from 'react';
import { Book, Video, FileText } from 'lucide-react';

export default function Education() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Wellness Education</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Book className="h-8 w-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-4">Wellness Guides</h2>
          <p className="text-gray-600 mb-6">
            Comprehensive guides on men's wellness, skincare, and lifestyle optimization.
          </p>
          <button className="btn">Browse Guides</button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Video className="h-8 w-8 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
          <p className="text-gray-600 mb-6">
            Expert-led video content on proper product usage and wellness techniques.
          </p>
          <button className="btn">Watch Videos</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
        <div className="space-y-6">
          {[
            {
              title: "The Complete Guide to Men's Skincare",
              excerpt: "Learn the essential steps for a proper skincare routine...",
              date: "March 15, 2024"
            },
            {
              title: "Understanding Supplements: A Beginner's Guide",
              excerpt: "Navigate the world of supplements with our comprehensive guide...",
              date: "March 12, 2024"
            },
            {
              title: "Grooming Essentials for the Modern Man",
              excerpt: "Discover the must-have grooming products for every man...",
              date: "March 10, 2024"
            }
          ].map((article, index) => (
            <article key={index} className="border-b last:border-0 pb-6 last:pb-0">
              <div className="flex items-start">
                <FileText className="h-6 w-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-2">{article.excerpt}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{article.date}</span>
                    <button className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}