class Log
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :is_dir, type: Mongoid::Boolean
  field :dir_path, type: String
  field :user, type: String
  field :agent, type: String
  index({ name: 1 }, { unique: true, name: "name_index" })

  # validate_presence_of :name, :is_dir, :dir_path, :user, :agent
end
