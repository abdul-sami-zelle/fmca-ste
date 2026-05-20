import React, { useState } from 'react';

const UserComment = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedContent = content?.length > 200 ? content?.slice(0, 200) + '...' : content;

  return (
    <div>
      <p className='comment-user-feedback'>
        {isExpanded ? content : truncatedContent}
      </p>
      {content.length > 200 && (
        <button className='comment-user-feedback-button' onClick={handleToggle}>
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default UserComment;
