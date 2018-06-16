class LogsController < ApplicationController
  skip_before_action :authenticate_user, only: %w[create]
  before_action :accept_json_only, only: [:index]
  before_action :admin?, only: %w[host_status monthly_status]
  before_action :content_type_json_only, only: [:create]
  before_action :set_logs, only: [:index]

  # GET /logs
  def index
    render json: @logs,
           status: !@logs.empty? ? :ok : :no_content,
           except: %w[_id logged_date]
  end

  # GET /logs/monthly_status
  def monthly_status
    render json: Log.inserted_logs_status('date'), status: :ok
  end

  # GET /logs/host_status
  def host_status
    render json: Log.inserted_logs_status('host'), status: :ok
  end

  # GET /logs/system_status
  def system_status
    render json: Log.count, status: :ok
  end

  # POST /logs
  def create
    Log.batch_save!(log_params)

    head :ok
  end

  private

  def admin?
    head :unauthorized unless current_user.admin?
  end

  def accept_json_only
    head :not_acceptable unless request.headers['Accept'] == 'application/json'
  end

  def content_type_json_only
    head :not_acceptable unless request.headers['Content-Type'] == 'application/json'
  end

  def set_logs
    page = params[:page].nil? ? 1 : params[:page]

    if params[:query].nil?
      @logs = {
        data: Log.ascending(:logged_time).page(page),
        count: Log.count,
        page: page
      }
    else
      lazy_col = Log.search(params[:query])
      @logs = {
        data: lazy_col.page(page),
        count: lazy_col.count,
        page: page
      }
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def log_params
    params.permit(logs: %i[host logged_date logged_time process severity message]).require(:logs)
  end
end
