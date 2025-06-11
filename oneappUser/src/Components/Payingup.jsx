import React, { useState, useEffect } from "react";
import { getPurchasedPayingUp } from "../Apicalls/productsPurchased";
import {
  Download,
  FileText,
  BookOpen,
  User,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Payingup = () => {
  const [purchasedPayingUp, setPurchasedPayingUp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedPayingUp = async () => {
      try {
        setLoading(true);
        const res = await getPurchasedPayingUp();
        setPurchasedPayingUp(res?.data?.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchased PDFs:", err);
        setError("Failed to load purchased content.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPayingUp();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!purchasedPayingUp.length)
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-10 h-10 text-green-400" />
        </div>
        <p className="text-gray-400">No purchased PDFs found.</p>
      </div>
    );

  console.log(purchasedPayingUp);

  function HtmlDescription({ htmlString }) {
    const [expanded, setExpanded] = useState(false);

    const stripHtml = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const plainText = stripHtml(htmlString);
    const words = plainText.split(/\s+/);
    const isLong = words.length > 50;

    const toggleExpanded = () => setExpanded((prev) => !prev);

    return (
      <div className="text-gray-400 text-sm">
        {expanded || !isLong ? (
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        ) : (
          <div>{words.slice(0, 50).join(" ")}...</div>
        )}

        {isLong && (
          <button
            onClick={toggleExpanded}
            className="text-blue-500 mt-1 text-xs underline"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {purchasedPayingUp.map((item, index) => {
        const pdf = item?.payingUp;
        const files = pdf?.files?.value || [];
        const category = pdf?.category;
        const createdBy = pdf?.createdBy;

        return (
          <div
            key={index}
            className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50 p-5 space-y-4"
          >
            {/* Cover Image */}
            {pdf?.coverImage?.value && (
              <img
                src={pdf.coverImage.value}
                alt={pdf.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            {/* Title */}
            <h2 className="text-xl font-semibold text-white">
              {pdf?.title || "Untitled"}
            </h2>

            {/* Author */}
            {createdBy?.name && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User size={14} />
                By {createdBy.name}
              </div>
            )}

            {/* Category Info */}
            {category?.title && (
              <div className="text-sm text-gray-400 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  <span>{category.title}</span>
                  <span className="flex items-center gap-1 ml-3">
                    {category.isActive ? (
                      <CheckCircle className="text-green-400" size={14} />
                    ) : (
                      <XCircle className="text-red-400" size={14} />
                    )}
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Category Metadata */}
                {Array.isArray(category.categoryMetaData) &&
                  category.categoryMetaData.length > 0 && (
                    <ul className="list-disc ml-6 text-xs text-gray-500">
                      {category.categoryMetaData.map((meta, metaIndex) => (
                        <li key={metaIndex}>{meta}</li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

            {/* Description */}
            {pdf?.description && (
              <HtmlDescription htmlString={pdf.description} />
            )}

            {/* Files Section */}
            <div className="space-y-2">
              {files?.map((file, fileIndex) => {
                if (!file) return null;
              

                const displayName =  `File ${Date.now()}`;

                return (
                  <div
                    key={fileIndex}
                    className="flex items-center justify-between bg-gray-700/30 px-4 py-2 rounded-md border border-gray-600/30"
                  >
                    <div className="flex items-center gap-2 text-sm text-white">
                      <FileText size={16} />
                      {displayName}
                    </div>

                    <a
                      href={file.signedUrl}
                      download
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-xs text-green-400 border-t border-gray-700/50 pt-2">
              Purchased PDF
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Payingup;
