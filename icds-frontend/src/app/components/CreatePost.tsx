export default function CreatePost() {
  return (
    <div>
      <form>
        <label htmlFor="content">Content</label>
        <input type="text" id="content" name="content" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}