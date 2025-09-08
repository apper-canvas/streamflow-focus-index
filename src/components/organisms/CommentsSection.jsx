import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { commentService } from "@/services/api/commentService";
import { toast } from "react-toastify";

const CommentsSection = ({ contactId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const loadComments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await commentService.getByContactId(contactId);
      setComments(data);
    } catch (err) {
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      loadComments();
    }
  }, [contactId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      await commentService.create({
        contactId: contactId,
        author: "Current User", // In real app, this would come from auth context
        content: newComment.trim()
      });
      setNewComment("");
      await loadComments();
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await commentService.update(commentId, {
        content: editContent.trim()
      });
      setEditingId(null);
      setEditContent("");
      await loadComments();
      toast.success("Comment updated successfully!");
    } catch (err) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentService.delete(commentId);
      await loadComments();
      toast.success("Comment deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.Id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  if (loading) return <Loading type="content" />;
  if (error) return <Error message={error} onRetry={loadComments} />;

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add Comment</h4>
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment about this contact..."
          rows={3}
          className="mb-3"
        />
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNewComment("")}
            disabled={!newComment.trim() || addingComment}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || addingComment}
            loading={addingComment}
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="MessageSquare" size={14} className="mr-2" />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.Id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {comment.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(comment.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                      {comment.edited && <span className="ml-1">(edited)</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(comment)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.Id)}
                    className="text-error hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>

              {editingId === comment.Id ? (
                <div className="space-y-3">
                  <TextArea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleEditComment(comment.Id)}
                      disabled={!editContent.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="MessageSquare" size={32} className="mx-auto mb-3 opacity-50" />
          <p>No comments yet</p>
          <p className="text-sm">Add the first comment about this contact</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;