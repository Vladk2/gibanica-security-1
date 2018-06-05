class LogsController < ApplicationController
  before_action :accept_json_only, only: [:index]
  before_action :admin?, only: %w[host_status monthly_status]
  before_action :content_type_json_only, only: [:create]
  before_action :set_log, only: [:show]

  # GET /logs
  def index
    logs = if params[:filterBy].nil?
             page = params[:page].nil? ? 1 : params[:page]
             {
               data: Log.page(page),
               count: Log.count,
               page: page
             }
           else
            # add pagination for query. first finish query lang
             Log.search(
                    params[:filterBy],
                    params[:searchBy],
                    page,
                    params[:page_size]
                )
           end

    render json: logs,
           status: !logs.nil? ? :ok : :not_found,
           except: %w[_id]
  end

  # GET /logs/monthly_status
  def monthly_status
    render json: Log.inserted_logs_status('days'), status: :ok
  end

  # GET /logs/host_status
  def host_status
    render json: Log.inserted_logs_status('host'), status: :ok
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

    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      # check for agents sending logs. based on agent, allow different params
      params.permit(logs: %i[host logged_date logged_time process severity message]).require(:logs)
    end
end
